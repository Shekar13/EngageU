require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/register", require("./routes/registrationRoutes"));

app.use("/api/clubs", require("./routes/clubRoutes"));


app.use("/api/apply", require("./routes/applicationRoutes"));


app.use("/api/admin", require("./routes/adminRoutes"));


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/engageU")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));

// Routes (we will add more)
app.get("/", (req, res) => {
    res.send("EngageU API is running...");
});

if (require.main === module) {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
}

module.exports = app;
