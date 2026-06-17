const mongoose = require("mongoose");

const SkillGapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  coding: {
    type: Number,
    required: true
  },
  aptitude: {
    type: Number,
    required: true
  },
  communication: {
    type: Number,
    required: true
  },
  interviewScore: {
    type: Number,
    required: true
  },
  weakAreas: [String],
  recommendations: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SkillGap", SkillGapSchema);
