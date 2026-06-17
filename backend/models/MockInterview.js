const mongoose = require("mongoose");

const MockInterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: [
      "HR",
      "TECHNICAL",
      "SITUATIONAL",
      "TCS",
      "INFOSYS",
      "WIPRO"
    ],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  feedback: {
    type: String, // Evaluator feedback JSON or text
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MockInterview", MockInterviewSchema);
