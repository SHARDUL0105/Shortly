const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: String,
  userAgent: String,
  referrer: String,
});

module.exports = mongoose.model("Click", clickSchema);
