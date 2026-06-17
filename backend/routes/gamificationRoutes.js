const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addXP, updateStreak, getLeaderboard, getUserStats } = require("../controllers/gamificationController");

router.post("/xp", auth, addXP);
router.post("/streak", auth, updateStreak);
router.get("/leaderboard", getLeaderboard);
router.get("/stats", auth, getUserStats);

module.exports = router;
