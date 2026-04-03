const router = require("express").Router();
const User = require("../models/User");
const { protect, allow } = require("../middleware/auth");


router.use(protect);


router.get("/", allow("admin"), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch("/:id/role", allow("admin"), async (req, res) => {
  const { role } = req.body;
  if (!["viewer", "analyst", "admin"].includes(role))
    return res.status(400).json({ message: "invalid role" });

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch("/:id/status", allow("admin"), async (req, res) => {
  const { status } = req.body;
  if (!["active", "inactive"].includes(status))
    return res.status(400).json({ message: "status must be active or inactive" });

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
