const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "not logged in" });

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: "user not found" });
    if (req.user.status === "inactive")
      return res.status(403).json({ message: "account is inactive" });
    next();
  } catch {
    res.status(401).json({ message: "invalid token" });
  }
};

const allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: "you don't have access to do this" });
  next();
};

module.exports = { protect, allow };
