const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');
const db      = require('../config/db'); // your mysql2 pool (see db.js file)
const authMiddleware = require('../middlewares/authmiddleware');
const router = express.Router();

// ── 1. Multer storage config ──────────────────────────────────────────────────
// Photos are saved to /uploads/avatars/ in your project root.
// Make sure this folder exists (created below) and is served statically.

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'avatars');

// Create upload directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // .jpg / .png etc.
    cb(null, `avatar_${uuidv4()}${ext}`);                     // unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const valid = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
    valid ? cb(null, true) : cb(new Error('Only image files (JPG, PNG, WEBP) are allowed.'));
  },
});

// ── 2. POST /api/profile/upload-photo ────────────────────────────────────────
// Body  : multipart/form-data with fields: photo (file), userId (string/int)
// Returns: { photoUrl: "/uploads/avatars/avatar_xxx.jpg" }

router.post('/upload-photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.file:", req.file);
    const userId = req.user.id; // remove after testing

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Build the public URL path that the frontend will use in <img src="">
    // Make sure you serve /uploads statically: app.use('/uploads', express.static('uploads'))
    const photoUrl = `http://localhost:5001/uploads/avatars/${req.file.filename}`;

    // Fetch old photo path so we can delete it from disk
    const [rows] = await db.execute(
      'SELECT profile_photo FROM users WHERE id = ?',
      [userId],
    );
    console.log("NEW PHOTO URL:", photoUrl);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const oldPhoto = rows[0].profile_photo;

    // ── 3. Update DB ──────────────────────────────────────────────────────────
    await db.execute(
      'UPDATE users SET profile_photo = ? WHERE id = ?',
      [photoUrl, userId]
    );

    // ── 4. Delete old photo file from disk (if it existed and is local) ───────
    if (oldPhoto && oldPhoto.startsWith('/uploads/')) {
      const oldFilePath = path.join(__dirname, '..', oldPhoto);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.warn('Could not delete old avatar:', err.message);
      });
    }

    return res.status(200).json({ photoUrl });

  } catch (err) {
    console.error('Upload error:', err);

    // If multer threw (file too large / wrong type), give a clear message
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max 5MB.' });
    }

    return res.status(500).json({ message: err.message || 'Server error.' });
  }
});

// ── 5. DELETE /api/profile/remove-photo ──────────────────────────────────────
// Body  : { userId }
// Removes the photo from disk and sets profile_photo = NULL in DB.

router.delete('/remove-photo', authMiddleware,  async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: 'User not authenticated.' });

    const [rows] = await db.execute(
      'SELECT profile_photo FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const oldPhoto = rows[0].profile_photo;

    await db.execute(
      'UPDATE users SET profile_photo = NULL WHERE id = ?',
      [userId]
    );

    if (oldPhoto) {
      const oldFilename = oldPhoto.split('/uploads/avatars/')[1];
      if (oldFilename) {
        const oldFilePath = path.join(__dirname, '..', 'uploads', 'avatars', oldFilename);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.warn('Could not delete old avatar:', err.message);
        });
      }
    }

    return res.status(200).json({ message: 'Photo removed.' });

  } catch (err) {
    console.error('Remove photo error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
