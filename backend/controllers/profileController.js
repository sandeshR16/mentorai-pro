const User = require("../models/User");
const Skill = require("../models/Skill");
const Interview = require("../models/Interview");
const mongoose = require("mongoose");

// Get profile, skills, and past interviews
exports.getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Serving mock user profile.");
      return res.json({
        user: {
          _id: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
          name: "Mock Student",
          email: "student@mentorai.com",
          branch: "Computer Science",
          semester: 6,
          readinessScore: 65
        },
        skills: {
          coding: 65,
          aptitude: 60,
          communication: 70
        },
        interviews: [
          {
            _id: "66708dc2cb4e92bb3c8c7f90",
            type: "TECHNICAL",
            question: "What is a closure in JavaScript?",
            answer: "A closure is the combination of a function bundled together with references to its surrounding state.",
            score: 8,
            feedback: "Great explanation of lexical scoping.",
            createdAt: new Date()
          }
        ]
      });
    }

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

    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Returning mock profile update.");
      return res.json({
        _id: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
        name: name || "Mock Student",
        email: "student@mentorai.com",
        branch: branch || "Computer Science",
        semester: semester !== undefined ? semester : 6,
        readinessScore: 65
      });
    }

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

    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Returning mock skills update.");
      const updatedCoding = coding !== undefined ? coding : 65;
      const updatedApti = aptitude !== undefined ? aptitude : 60;
      const updatedComm = communication !== undefined ? communication : 70;
      const readinessScore = Math.round((updatedCoding + updatedApti + updatedComm) / 3);
      return res.json({
        user: {
          _id: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
          name: "Mock Student",
          email: "student@mentorai.com",
          branch: "Computer Science",
          semester: 6,
          readinessScore
        },
        skills: {
          coding: updatedCoding,
          aptitude: updatedApti,
          communication: updatedComm
        }
      });
    }
    
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

    if (mongoose.connection.readyState !== 1) {
      console.log("Database offline. Returning mock interview record addition.");
      return res.json({
        _id: "66708dc2cb4e92bb3c8c7f" + Math.floor(Math.random() * 100),
        userId: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
        question,
        answer,
        score,
        createdAt: new Date()
      });
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
