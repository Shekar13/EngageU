const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "student"   // admin, club_admin, or student
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

module.exports = mongoose.model("User", userSchema);
