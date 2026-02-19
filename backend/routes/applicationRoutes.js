const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// Apply to club
router.post("/", async (req, res) => {
  const { userId, clubId } = req.body;

  const already = await Application.findOne({ userId, clubId });
  if (already) return res.status(400).json({ msg: "Already applied" });

  const app = await Application.create({ userId, clubId });
  res.json(app);
});

// Get applied clubs of a user
router.get("/:userId", async (req, res) => {
  const data = await Application.find({ userId: req.params.userId })
    .populate("clubId");
  res.json(data);
});

// UPDATE APPLICATION STATUS (Admin)
router.put("/:id", async (req, res) => {
  const { status, interviewLink, interviewDate, interviewTime, adminFeedback } = req.body;

  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status, interviewLink, interviewDate, interviewTime, adminFeedback },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
