const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });


router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "name, email and password are required" });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "email already in use" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: makeToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "email and password required" });

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "invalid credentials" });

    if (user.status === "inactive")
      return res.status(403).json({ message: "account is inactive" });

    res.json({ token: makeToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
