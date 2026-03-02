const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check karein ki user exist karta hai ya nahi
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "User does not exist!Create an account." });
    }

    const user = users[0];

    // 2. Password match karein (Hashed password ke sath)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials (galat password)." });
    }

    // 3. Token generate karein
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // 1 din tak login rahega
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.signup = async (req, res) => {
  const { username, email, password, hometown } = req.body;

  // 1. Basic Validation
  if (!username || !email || !password || !hometown) {
    return res
      .status(400)
      .json({ message: "All field are required!" });
  }

  // 2. NIT KKR Email Check
  if (!email.endsWith("@nitkkr.ac.in")) {
    return res
      .status(400)
      .json({ message: "Sirf @nitkkr.ac.in email hi allowed hai!" });
  }

  try {
    // 3. Check if user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Email pehle se registered hai!" });
    }

    // 4. Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Save to SQL
    const sql =
      "INSERT INTO users (username, email, password, hometown) VALUES (?, ?, ?, ?)";
    await db.query(sql, [username, email, hashedPassword, hometown]);

    res.status(201).json({ message: "Account created!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};