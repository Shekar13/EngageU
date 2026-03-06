const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: String,
  description: String,
  recruiting: Boolean,
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model("Club", clubSchema);
