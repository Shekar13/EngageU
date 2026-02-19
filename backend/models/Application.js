const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club"
  },
  status: {
    type: String,
    enum: ["Applied", "Interview Scheduled", "Approved", "Rejected"],
    default: "Applied"
  },
  interviewLink: {
    type: String, // Google Meet Link
  },
  interviewDate: {
    type: String // e.g., "2026-03-25"
  },
  interviewTime: {
    type: String // e.g., "10:00 AM"
  },
  adminFeedback: {
    type: String
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Application", applicationSchema);
