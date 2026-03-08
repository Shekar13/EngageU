const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const admin = require("../middleware/admin");

// Add Event (Admin later)
router.post("/", admin, async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
});

// Get all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Update Event
router.put("/:id", admin, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) return res.status(404).json({ msg: "Event not found" });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete Event
router.delete("/:id", admin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
