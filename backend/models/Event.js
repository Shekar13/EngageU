const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    venue: String,
    maxCapacity: { type: Number, default: 0 }, // 0 means unlimited
    registeredCount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 }
});

module.exports = mongoose.model("Event", eventSchema);
