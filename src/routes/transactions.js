const router = require("express").Router();
const Transaction = require("../models/Transaction");
const { protect, allow } = require("../middleware/auth");

router.use(protect);


router.get("/", allow("viewer", "analyst", "admin"), async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filter = { deleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const txs = await Transaction.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    res.json({ transactions: txs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", allow("viewer", "analyst", "admin"), async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, deleted: false }).populate("createdBy", "name email");
    if (!tx) return res.status(404).json({ message: "transaction not found" });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", allow("admin"), async (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  if (!amount || !type || !category)
    return res.status(400).json({ message: "amount, type and category are required" });

  try {
    const tx = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id,
    });
    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.patch("/:id", allow("admin"), async (req, res) => {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!tx) return res.status(404).json({ message: "transaction not found" });
    res.json(tx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", allow("admin"), async (req, res) => {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: "transaction not found" });
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
