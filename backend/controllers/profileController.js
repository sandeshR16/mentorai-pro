const db = require("../config/dbAdapter");

// Get profile, skills, and past interviews
exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    let user = db.findOne("users", { _id: userId });
    if (!user) {
      // Auto-create profile row if it doesn't exist
      user = db.create("users", {
        _id: userId,
        name: req.user.name || "Mock Student",
        email: req.user.email || "student@mentorai.com",
        branch: req.user.branch || "Computer Science & Engineering",
        semester: Number(req.user.semester) || 6,
        readinessScore: 65
      });
    }

    let skills = db.findOne("skills", { userId });
    if (!skills) {
      skills = db.create("skills", {
        userId,
        coding: 65,
        aptitude: 60,
        communication: 70
      });
    }

    const interviews = db.find("interviews", { userId });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        readinessScore: user.readinessScore || 65
      },
      skills: {
        coding: skills.coding,
        aptitude: skills.aptitude,
        communication: skills.communication
      },
      interviews: (interviews || []).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (err) {
    console.error("Local fetch profile error:", err);
    res.status(500).json({ message: "Server error fetching user profile" });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, branch, semester } = req.body;
  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (branch) updateData.branch = branch;
    if (semester !== undefined) updateData.semester = Number(semester);

    const user = db.updateOne("users", { _id: userId }, updateData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      branch: user.branch,
      semester: user.semester,
      readinessScore: user.readinessScore
    });
  } catch (err) {
    console.error("Local update profile error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Update skills and recalculate readiness score
exports.updateSkills = async (req, res) => {
  const userId = req.user.id;
  const { coding, aptitude, communication } = req.body;
  try {
    let codingVal = coding !== undefined ? coding : 65;
    let aptiVal = aptitude !== undefined ? aptitude : 60;
    let commVal = communication !== undefined ? communication : 70;

    const currentSkills = db.findOne("skills", { userId });
    if (currentSkills) {
      if (coding !== undefined) codingVal = coding;
      else codingVal = currentSkills.coding;
      
      if (aptitude !== undefined) aptiVal = aptitude;
      else aptiVal = currentSkills.aptitude;
      
      if (communication !== undefined) commVal = communication;
      else commVal = currentSkills.communication;
    }

    const skills = db.upsert("skills", { userId }, {
      coding: codingVal,
      aptitude: aptiVal,
      communication: commVal
    });

    const readinessScore = Math.round((skills.coding + skills.aptitude + skills.communication) / 3);

    const user = db.updateOne("users", { _id: userId }, { readinessScore });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        readinessScore: user.readinessScore
      },
      skills: {
        coding: skills.coding,
        aptitude: skills.aptitude,
        communication: skills.communication
      }
    });
  } catch (err) {
    console.error("Local update skills error:", err);
    res.status(500).json({ message: "Server error updating skills gap values" });
  }
};

// Add a mock interview record
exports.addInterview = async (req, res) => {
  const userId = req.user.id;
  const { question, answer, score, type, feedback } = req.body;
  try {
    const interview = db.create("interviews", {
      userId,
      type: type || "TECHNICAL",
      question,
      answer,
      score,
      feedback: feedback || ""
    });

    res.json(interview);
  } catch (err) {
    console.error("Local add interview error:", err);
    res.status(500).json({ message: "Server error creating interview record" });
  }
};
