const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1. Header se token nikaalna
  // Note: Frontend se hum aksar 'Bearer <token>' bhejte hain
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied. Please login!" });
  }

  // Agar token "Bearer xyz123" format mein hai toh usey split karein
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    // 2. Token verify karna
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Request object mein user data add karna
    // Ab aap req.user.id use kar payenge controller mein
    req.user = verified;

    next(); // Agle function (controller) par bhejo
  } catch (err) {
    // 4. Agar token expired hai ya galat hai
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
