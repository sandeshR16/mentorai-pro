const SkillGap = require("../models/SkillGap");
const Skill = require("../models/Skill");
const MockInterview = require("../models/MockInterview");
const mongoose = require("mongoose");

exports.analyzeSkills = async (req, res) => {
  try {
    let { coding, aptitude, communication, interviewScore } = req.body;

    // Check database fallbacks if parameters are omitted in request body
    if (coding === undefined || aptitude === undefined || communication === undefined) {
      if (mongoose.connection.readyState === 1) {
        const skills = await Skill.findOne({ userId: req.user.id });
        if (skills) {
          if (coding === undefined) coding = skills.coding;
          if (aptitude === undefined) aptitude = skills.aptitude;
          if (communication === undefined) communication = skills.communication;
        }
      }
      
      // Default offline/fallback values
      if (coding === undefined) coding = 65;
      if (aptitude === undefined) aptitude = 60;
      if (communication === undefined) communication = 70;
    }

    if (interviewScore === undefined) {
      if (mongoose.connection.readyState === 1) {
        const interviews = await MockInterview.find({ userId: req.user.id });
        if (interviews && interviews.length > 0) {
          const sum = interviews.reduce((acc, curr) => acc + curr.score, 0);
          interviewScore = Math.round((sum / interviews.length) * 10) / 10;
        }
      }
      
      if (interviewScore === undefined) {
        interviewScore = 7.5; // default baseline out of 10
      }
    }

    let weakAreas = [];
    let recommendations = [];

    if (coding < 70) {
      weakAreas.push("Coding");
      recommendations.push("Practice DSA daily");
    }

    if (aptitude < 70) {
      weakAreas.push("Aptitude");
      recommendations.push("Solve aptitude tests");
    }

    if (communication < 70) {
      weakAreas.push("Communication");
      recommendations.push("Practice mock interviews");
    }

    if (interviewScore < 7) {
      weakAreas.push("Interview Performance");
      recommendations.push("Attend more mock interviews");
    }

    if (weakAreas.length === 0) {
      weakAreas.push("None");
      recommendations.push("Excellent work! Continue mock reviews to stay sharp.");
    }

    const reportData = {
      userId: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
      coding,
      aptitude,
      communication,
      interviewScore,
      weakAreas,
      recommendations
    };

    let report;
    if (mongoose.connection.readyState === 1) {
      report = await SkillGap.create(reportData);
    } else {
      console.log("Database offline. Generating mock skill gap report.");
      report = {
        _id: "66708dc2cb4e92bb3c8c7f" + Math.floor(Math.random() * 100),
        ...reportData,
        createdAt: new Date()
      };
    }

    res.json(report);
  } catch (err) {
    console.error("Skill Gap Analysis Error:", err);
    res.status(500).json({ message: "Server error generating analysis report" });
  }
};
