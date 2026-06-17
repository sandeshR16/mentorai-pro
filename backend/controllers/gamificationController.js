const Gamification = require("../models/Gamification");
const User = require("../models/User");

// Fetch stats, create if not present
exports.getUserStats = async (req, res) => {
  try {
    let stats = await Gamification.findOne({ userId: req.user.id });
    if (!stats) {
      stats = await Gamification.create({
        userId: req.user.id,
        xp: 10, // starting bonus
        level: 1,
        streak: 1,
        badges: ["Beginner"],
        lastLogin: new Date()
      });
    }
    res.json(stats);
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ message: "Server error fetching gamification stats" });
  }
};

exports.addXP = async (req, res) => {
  try {
    const { xp } = req.body;
    if (xp === undefined) {
      return res.status(400).json({ message: "XP amount is required" });
    }

    let user = await Gamification.findOne({ userId: req.user.id });
    if (!user) {
      user = await Gamification.create({
        userId: req.user.id
      });
    }

    user.xp += Number(xp);
    user.level = Math.floor(user.xp / 100) + 1;

    // Badges unlock checks
    if (user.xp >= 100 && !user.badges.includes("Beginner")) {
      user.badges.push("Beginner");
    }

    if (user.xp >= 300 && !user.badges.includes("Quiz Whiz")) {
      user.badges.push("Quiz Whiz");
    }

    if (user.xp >= 500 && !user.badges.includes("Interview Master")) {
      user.badges.push("Interview Master");
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Add XP error:", err);
    res.status(500).json({ message: "Server error adding XP points" });
  }
};

exports.updateStreak = async (req, res) => {
  try {
    let user = await Gamification.findOne({ userId: req.user.id });
    if (!user) {
      user = await Gamification.create({
        userId: req.user.id
      });
    }

    const today = new Date();
    const last = user.lastLogin;

    if (last) {
      // Calculate differences in days
      const diffTime = Math.abs(today - last);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak++;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    user.lastLogin = today;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Update streak error:", err);
    res.status(500).json({ message: "Server error checking login streak" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Gamification.find()
      .populate("userId", "name branch")
      .sort({ xp: -1 })
      .limit(10);

    res.json(leaderboard);
  } catch (err) {
    console.error("Get leaderboard error:", err);
    res.status(500).json({ message: "Server error loading leaderboard" });
  }
};
