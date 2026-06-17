const Gamification = require("../models/Gamification");
const User = require("../models/User");
const mongoose = require("mongoose");

// Fetch stats, create if not present
exports.getUserStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Returning mock gamification stats.");
      return res.json({
        userId: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
        xp: 120,
        level: 2,
        streak: 3,
        badges: ["Beginner", "Quiz Whiz"],
        lastLogin: new Date()
      });
    }

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

    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Processing mock XP addition.");
      const currentXp = 120 + Number(xp);
      const level = Math.floor(currentXp / 100) + 1;
      const badges = ["Beginner", "Quiz Whiz"];
      if (currentXp >= 500) badges.push("Interview Master");
      return res.json({
        userId: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
        xp: currentXp,
        level,
        streak: 3,
        badges,
        lastLogin: new Date()
      });
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
    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Returning mock login streak.");
      return res.json({
        userId: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
        xp: 120,
        level: 2,
        streak: 4,
        badges: ["Beginner", "Quiz Whiz"],
        lastLogin: new Date()
      });
    }

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
    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Returning mock leaderboard.");
      return res.json([
        {
          _id: "leader1",
          userId: { _id: "u1", name: "Ananya Sharma", branch: "Computer Science" },
          xp: 680,
          level: 7,
          streak: 12,
          badges: ["Beginner", "Quiz Whiz", "Interview Master"]
        },
        {
          _id: "leader2",
          userId: { _id: "u2", name: "Rohan Das", branch: "Information Science" },
          xp: 450,
          level: 5,
          streak: 8,
          badges: ["Beginner", "Quiz Whiz"]
        },
        {
          _id: "leader3",
          userId: { _id: "u3", name: "Mock Student (You)", branch: "Computer Science" },
          xp: 120,
          level: 2,
          streak: 3,
          badges: ["Beginner", "Quiz Whiz"]
        },
        {
          _id: "leader4",
          userId: { _id: "u4", name: "Sneha Reddy", branch: "Electronics" },
          xp: 90,
          level: 1,
          streak: 1,
          badges: ["Beginner"]
        }
      ]);
    }

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
