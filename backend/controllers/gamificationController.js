const db = require("../config/dbAdapter");

// Fetch stats, create if not present
exports.getUserStats = async (req, res) => {
  const userId = req.user.id;
  try {
    let stats = db.findOne("gamification", { userId });
    if (!stats) {
      stats = db.create("gamification", {
        userId,
        xp: 10,
        level: 1,
        streak: 1,
        badges: ["Beginner"]
      });
    }

    res.json({
      userId: stats.userId,
      xp: stats.xp,
      level: stats.level,
      streak: stats.streak,
      badges: stats.badges
    });
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ message: "Server error fetching gamification stats" });
  }
};

exports.addXP = async (req, res) => {
  const userId = req.user.id;
  try {
    const { xp } = req.body;
    if (xp === undefined) {
      return res.status(400).json({ message: "XP amount is required" });
    }

    let stats = db.findOne("gamification", { userId });
    if (!stats) {
      stats = db.create("gamification", {
        userId,
        xp: 10,
        level: 1,
        streak: 1,
        badges: ["Beginner"]
      });
    }

    const newXp = stats.xp + Number(xp);
    const level = Math.floor(newXp / 100) + 1;
    const badges = stats.badges || ["Beginner"];

    // Badges checks
    if (newXp >= 100 && !badges.includes("Beginner")) {
      badges.push("Beginner");
    }
    if (newXp >= 300 && !badges.includes("Quiz Whiz")) {
      badges.push("Quiz Whiz");
    }
    if (newXp >= 550 && !badges.includes("Interview Master")) {
      badges.push("Interview Master");
    }

    const updated = db.updateOne("gamification", { userId }, {
      xp: newXp,
      level,
      badges
    });

    res.json({
      userId: updated.userId,
      xp: updated.xp,
      level: updated.level,
      streak: updated.streak,
      badges: updated.badges
    });
  } catch (err) {
    console.error("Add XP error:", err);
    res.status(500).json({ message: "Server error adding XP points" });
  }
};

exports.updateStreak = async (req, res) => {
  const userId = req.user.id;
  try {
    let stats = db.findOne("gamification", { userId });
    if (!stats) {
      stats = db.create("gamification", {
        userId,
        xp: 10,
        level: 1,
        streak: 1,
        badges: ["Beginner"]
      });
    }

    const newStreak = (stats.streak || 0) + 1;
    const updated = db.updateOne("gamification", { userId }, { streak: newStreak });

    res.json({
      userId: updated.userId,
      xp: updated.xp,
      level: updated.level,
      streak: updated.streak,
      badges: updated.badges
    });
  } catch (err) {
    console.error("Update streak error:", err);
    res.status(500).json({ message: "Server error checking login streak" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const gamifications = db.find("gamification");
    
    const leaderboard = gamifications.map((item, idx) => {
      // Find candidate name and branch from users table
      const user = db.findOne("users", { _id: item.userId });
      return {
        _id: item._id || `leader_${idx}`,
        xp: item.xp,
        level: item.level,
        streak: item.streak,
        badges: item.badges,
        userId: {
          _id: item.userId,
          name: user ? user.name : "Anonymous Candidate",
          branch: user ? user.branch : "Computer Science & Engineering"
        }
      };
    });

    // Sort by XP descending
    leaderboard.sort((a, b) => b.xp - a.xp);

    res.json(leaderboard.slice(0, 10));
  } catch (err) {
    console.error("Get leaderboard error:", err);
    res.status(500).json({ message: "Server error loading leaderboard listings" });
  }
};
