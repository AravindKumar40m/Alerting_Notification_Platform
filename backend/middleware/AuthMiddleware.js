const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ error: "Admin access required" });
  next();
};

module.exports = { authenticate, authorizeAdmin };
