const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: String,
  description: String,
  recruiting: Boolean
});

module.exports = mongoose.model("Club", clubSchema);
