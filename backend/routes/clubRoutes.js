const express = require("express");
const router = express.Router();
const Club = require("../models/Club");
const User = require("../models/User");
const superAdmin = require("../middleware/superAdmin");

// Add club
router.post("/", superAdmin, async (req, res) => {
  const { name, description, recruiting, adminEmail } = req.body;

  let admins = [];
  if (adminEmail) {
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      return res.status(400).json({ msg: "User with this email not found. Cannot assign Club Admin." });
    }
    if (adminUser.role !== "admin") {
      adminUser.role = "club_admin";
      await adminUser.save();
    }
    admins.push(adminUser._id);
  }

  const club = await Club.create({ name, description, recruiting, admins });
  res.json(club);
});

// Get all clubs
router.get("/", async (req, res) => {
  const clubs = await Club.find();
  res.json(clubs);
});

// Delete club
router.delete("/:id", superAdmin, async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ msg: "Club deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
