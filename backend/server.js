require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/register", require("./routes/registrationRoutes"));
app.use("/api/clubs", require("./routes/clubRoutes"));
app.use("/api/apply", require("./routes/applicationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("EngageU API is running...");
});

// MongoDB Connection + Server Start
if (!process.env.MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI environment variable is not defined");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected: Application is ready");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

module.exports = app;