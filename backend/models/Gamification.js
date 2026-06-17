const mongoose = require("mongoose");

const GamificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  badges: [String],
  lastLogin: {
    type: Date
  }
});

module.exports = mongoose.model("Gamification", GamificationSchema);
