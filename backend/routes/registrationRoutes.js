const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

const Event = require("../models/Event");

// Register for an event
router.post("/", async (req, res) => {
    const { userId, eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Check Capacity
    if (event.maxCapacity > 0 && event.registeredCount >= event.maxCapacity) {
        return res.status(400).json({ msg: "Event is full" });
    }

    const already = await Registration.findOne({ userId, eventId });
    if (already) return res.status(400).json({ msg: "Already registered" });

    // Register
    const reg = await Registration.create({ userId, eventId });

    // Increment Count
    event.registeredCount += 1;
    await event.save();

    res.json(reg);
});

// Get registrations of a user
router.get("/:userId", async (req, res) => {
    const data = await Registration.find({ userId: req.params.userId })
        .populate("eventId");
    res.json(data);
});

module.exports = router;
