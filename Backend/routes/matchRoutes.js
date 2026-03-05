const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed
const { authenticateToken } = require('../middlewares/auth'); // Adjust path

// GET /api/match/find
router.get('/find', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current user with their communities
    const currentUser = await User.findById(userId).populate('communities');
    
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find users with matching communities
    const matches = await User.find({
      _id: { $ne: userId }, // Exclude current user
      communities: { $in: currentUser.communities.map(c => c._id) }
    })
    .populate('communities')
    .select('-password') // Don't send passwords
    .limit(20);
    
    res.json(matches);
  } catch (error) {
    console.error('Find match error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;