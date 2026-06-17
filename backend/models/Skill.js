const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  coding: {
    type: Number,
    default: 0
  },
  aptitude: {
    type: Number,
    default: 0
  },
  communication: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Skill", SkillSchema);
