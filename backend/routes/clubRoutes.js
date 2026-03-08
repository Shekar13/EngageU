const express = require("express");
const router = express.Router();
const Club = require("../models/Club");
const User = require("../models/User");
const superAdmin = require("../middleware/superAdmin");
const admin = require("../middleware/admin");

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

// Update club
router.put("/:id", admin, async (req, res) => {
  try {
    const { name, description, recruiting, adminEmail } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ msg: "Club not found" });

    // Authorization: Super Admins can edit any club. Club Admins can only edit their own clubs.
    if (req.user.role === "club_admin") {
      if (!club.admins.includes(req.user._id.toString())) {
        return res.status(403).json({ msg: "Not authorized to update this club" });
      }
    }

    if (name !== undefined) club.name = name;
    if (description !== undefined) club.description = description;
    if (recruiting !== undefined) {
      club.recruiting = recruiting;
    }

    // Only superadmin can change the assigned admin
    if (req.user.role === "admin" && adminEmail) {
      const newAdmin = await User.findOne({ email: adminEmail });
      if (!newAdmin) {
        return res.status(400).json({ msg: "User with this email not found." });
      }
      if (newAdmin.role !== "admin") {
        newAdmin.role = "club_admin";
        await newAdmin.save();
      }
      // Overwrite admins array with the new single admin
      club.admins = [newAdmin._id];
    }

    await club.save();
    res.json(club);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
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
