const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const admin = require("../middleware/admin");

// Add Event (Admin later)
router.post("/", async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
});

// Get all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Delete Event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
