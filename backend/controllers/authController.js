const db = require("../config/dbAdapter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to generate a token with full user context
const generateSessionToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      name: user.name,
      branch: user.branch,
      semester: Number(user.semester)
    },
    process.env.JWT_SECRET || "mentorai123",
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, branch, semester } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = db.findOne("users", { email });
    if (user) {
      // If user exists, do login instead for seamless offline testing
      const token = generateSessionToken(user);
      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          branch: user.branch,
          semester: user.semester,
          readinessScore: user.readinessScore || 50
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password || "password123", 10);
    user = db.create("users", {
      name: name || email.split("@")[0],
      email,
      password: hashedPassword,
      branch: branch || "Computer Science & Engineering",
      semester: Number(semester) || 6,
      readinessScore: 50
    });

    // Create default skill record
    db.create("skills", {
      userId: user._id,
      coding: 50,
      aptitude: 50,
      communication: 50
    });

    // Create default gamification record
    db.create("gamification", {
      userId: user._id,
      xp: 10,
      level: 1,
      streak: 1,
      badges: ["Beginner"]
    });

    const token = generateSessionToken(user);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        readinessScore: user.readinessScore
      }
    });
  } catch (err) {
    console.error("Local register error:", err);
    res.status(500).json({ message: "Server error during registration fallback" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = db.findOne("users", { email });
    if (!user) {
      // Auto-create user for seamless credentials bypass (frictionless login)
      const hashedPassword = await bcrypt.hash(password || "password123", 10);
      user = db.create("users", {
        name: email.split("@")[0],
        email,
        password: hashedPassword,
        branch: "Computer Science & Engineering",
        semester: 6,
        readinessScore: 50
      });

      db.create("skills", {
        userId: user._id,
        coding: 50,
        aptitude: 50,
        communication: 50
      });

      db.create("gamification", {
        userId: user._id,
        xp: 10,
        level: 1,
        streak: 1,
        badges: ["Beginner"]
      });
    }

    const token = generateSessionToken(user);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        readinessScore: user.readinessScore || 50
      }
    });
  } catch (err) {
    console.error("Local login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
