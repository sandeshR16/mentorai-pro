const User = require("../models/User");
const Skill = require("../models/Skill");
const Interview = require("../models/Interview");

// Get profile, skills, and past interviews
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    let skills = await Skill.findOne({ userId: user._id });
    if (!skills) {
      skills = await Skill.create({
        userId: user._id,
        coding: 50,
        aptitude: 50,
        communication: 50
      });
    }

    const interviews = await Interview.find({ userId: user._id }).sort({ createdAt: -1 });

    res.json({
      user,
      skills,
      interviews
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  try {
    const { name, branch, semester } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (branch) updateData.branch = branch;
    if (semester !== undefined) updateData.semester = semester;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Update skills and recalculate readiness score
exports.updateSkills = async (req, res) => {
  try {
    const { coding, aptitude, communication } = req.body;
    
    let skills = await Skill.findOne({ userId: req.user.id });
    if (!skills) {
      skills = new Skill({ userId: req.user.id });
    }

    if (coding !== undefined) skills.coding = coding;
    if (aptitude !== undefined) skills.aptitude = aptitude;
    if (communication !== undefined) skills.communication = communication;

    await skills.save();

    // Recalculate readiness score: average of the three skills
    const readinessScore = Math.round((skills.coding + skills.aptitude + skills.communication) / 3);
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { readinessScore } },
      { new: true }
    ).select("-password");

    res.json({
      user,
      skills
    });
  } catch (err) {
    console.error("Update skills error:", err);
    res.status(500).json({ message: "Server error updating skills" });
  }
};

// Add a mock interview record
exports.addInterview = async (req, res) => {
  try {
    const { question, answer, score } = req.body;
    if (!question || !answer || score === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const interview = await Interview.create({
      userId: req.user.id,
      question,
      answer,
      score
    });

    res.json(interview);
  } catch (err) {
    console.error("Add interview error:", err);
    res.status(500).json({ message: "Server error creating interview" });
  }
};
