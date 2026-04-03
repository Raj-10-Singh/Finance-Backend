const router = require("express").Router();
const Transaction = require("../models/Transaction");
const { protect, allow } = require("../middleware/auth");

router.use(protect);
router.use(allow("viewer", "analyst", "admin"));


router.get("/summary", async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    let income = 0, expenses = 0;
    result.forEach((r) => {
      if (r._id === "income") income = r.total;
      if (r._id === "expense") expenses = r.total;
    });

    res.json({ income, expenses, balance: income - expenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/categories", async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: { category: "$category", type: "$type" }, total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/monthly", async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const data = await Transaction.aggregate([
      { $match: { deleted: false, date: { $gte: since } } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/recent", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recent = await Transaction.find({ deleted: false })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(recent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
