const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { analyzeSkills } = require("../controllers/skillGapController");

router.post("/analyze", auth, analyzeSkills);

module.exports = router;
