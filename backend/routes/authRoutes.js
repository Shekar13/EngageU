const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "student"
    });

    res.json({ msg: "User registered successfully", role: "student" });
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

const crypto = require("crypto");
const nodemailer = require("nodemailer");

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User with this email does not exist" });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash it before saving to database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 Minutes

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        // Send Email
        try {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "EngageU - Password Reset Request",
                html: `
                    <h1>You have requested a password reset</h1>
                    <p>Please go to this link to reset your password:</p>
                    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
                `
            };

            await transporter.sendMail(mailOptions);

            res.json({ msg: "Email sent successfully! Please check your inbox." });
        } catch (error) {
            console.error("Email sending failed", error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ msg: "Email could not be sent" });
        }

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
    try {
        // Find user by token and check if the token has not expired
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired reset token" });
        }

        // Hash new password
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ msg: "Password successfully reset! You can now log in." });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

const auth = require("../middleware/auth");

// CHANGE PASSWORD (Logged in users only)
router.post("/change-password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Use req.user from auth middleware
        const user = req.user;

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect current password" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.json({ msg: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
