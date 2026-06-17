const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { generateQuestion, submitAnswer } = require("../controllers/interviewController");

router.post("/question", auth, generateQuestion);
router.post("/submit", auth, submitAnswer);

module.exports = router;
