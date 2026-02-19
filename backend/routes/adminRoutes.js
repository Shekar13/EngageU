const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Application = require("../models/Application");
const admin = require("../middleware/admin");

// All event registrations
router.get("/registrations", admin, async (req, res) => {
  const data = await Registration.find()
    .populate("userId")
    .populate("eventId");

  res.json(data);
});

// All club applications
router.get("/applications", admin, async (req, res) => {
  const data = await Application.find()
    .populate("userId")
    .populate("clubId");

  res.json(data);
});

module.exports = router;
