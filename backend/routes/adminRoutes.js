const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Application = require("../models/Application");
const admin = require("../middleware/admin");

const Club = require("../models/Club");
const Event = require("../models/Event");

// All event registrations
router.get("/registrations", admin, async (req, res) => {
  if (req.user.role === "admin") {
    const data = await Registration.find()
      .populate("userId")
      .populate("eventId");
    return res.json(data);
  } else if (req.user.role === "club_admin") {
    const managedClubs = await Club.find({ admins: req.user._id });
    const clubIds = managedClubs.map(c => c._id);

    const managedEvents = await Event.find({ clubId: { $in: clubIds } });
    const eventIds = managedEvents.map(e => e._id);

    const data = await Registration.find({ eventId: { $in: eventIds } })
      .populate("userId")
      .populate("eventId");
    return res.json(data);
  }
});

// All club applications
router.get("/applications", admin, async (req, res) => {
  if (req.user.role === "admin") {
    const data = await Application.find()
      .populate("userId")
      .populate("clubId");
    return res.json(data);
  } else if (req.user.role === "club_admin") {
    const managedClubs = await Club.find({ admins: req.user._id });
    const clubIds = managedClubs.map(c => c._id);

    const data = await Application.find({ clubId: { $in: clubIds } })
      .populate("userId")
      .populate("clubId");
    return res.json(data);
  }
});

module.exports = router;
