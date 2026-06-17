const User = require("../models/User");
const Skill = require("../models/Skill");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, branch, semester } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      branch,
      semester,
      readinessScore: 50 // Default baseline score
    });

    // Create default skill records
    await Skill.create({
      userId: user._id,
      coding: 50,
      aptitude: 50,
      communication: 50
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "mentorai123",
      { expiresIn: "7d" }
    );

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
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    // Ensure they have a Skill document (in case of legacy/existing mock users)
    const existingSkill = await Skill.findOne({ userId: user._id });
    if (!existingSkill) {
      await Skill.create({
        userId: user._id,
        coding: 50,
        aptitude: 50,
        communication: 50
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "mentorai123",
      { expiresIn: "7d" }
    );

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
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
