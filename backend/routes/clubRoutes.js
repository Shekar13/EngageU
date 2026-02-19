const express = require("express");
const router = express.Router();
const Club = require("../models/Club");

// Add club
router.post("/", async (req, res) => {
  const club = await Club.create(req.body);
  res.json(club);
});

// Get all clubs
router.get("/", async (req, res) => {
  const clubs = await Club.find();
  res.json(clubs);
});

// Delete club
router.delete("/:id", async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ msg: "Club deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
