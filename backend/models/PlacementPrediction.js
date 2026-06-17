const mongoose = require("mongoose");

const PlacementPredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cgpa: {
    type: Number,
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
  readinessScore: {
    type: Number,
    required: true
  },
  companies: {
    tcs: { type: Number, default: 0 },
    infosys: { type: Number, default: 0 },
    wipro: { type: Number, default: 0 },
    accenture: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PlacementPrediction", PlacementPredictionSchema);
