const db = require("../config/dbAdapter");

exports.getLatestPrediction = async (req, res) => {
  const userId = req.user.id;
  try {
    let prediction = db.findOne("predictions", { userId });
    if (!prediction) {
      // Lazy calculation using active user skills
      const skills = db.findOne("skills", { userId }) || { coding: 50, aptitude: 50, communication: 50 };
      const coding = skills.coding;
      const aptitude = skills.aptitude;
      const communication = skills.communication;
      const cgpa = 7.5; // default benchmark

      const readinessScore = Math.round(
        cgpa * 10 * 0.30 +
        coding * 0.30 +
        aptitude * 0.20 +
        communication * 0.20
      );

      const companies = {
        tcs: Math.round(Math.min(100, readinessScore + 5)),
        infosys: Math.round(Math.min(100, readinessScore)),
        wipro: Math.round(Math.min(100, readinessScore - 3)),
        accenture: Math.round(Math.min(100, readinessScore + 2))
      };

      prediction = db.create("predictions", {
        userId,
        cgpa,
        readinessScore,
        companies
      });
    }

    res.json({
      _id: prediction._id,
      userId: prediction.userId,
      cgpa: prediction.cgpa,
      readinessScore: prediction.readinessScore,
      companies: prediction.companies
    });
  } catch (err) {
    console.error("Local fetch latest prediction error:", err);
    res.status(500).json({ message: "Server error calculating latest readiness forecast" });
  }
};

exports.predictPlacement = async (req, res) => {
  const userId = req.user.id;
  try {
    const { cgpa, coding, aptitude, communication } = req.body;

    if (cgpa === undefined || coding === undefined || aptitude === undefined || communication === undefined) {
      return res.status(400).json({ message: "Missing required attributes for prediction" });
    }

    const readinessScore = Math.round(
      cgpa * 10 * 0.30 +
      coding * 0.30 +
      aptitude * 0.20 +
      communication * 0.20
    );

    const companies = {
      tcs: Math.round(Math.min(100, readinessScore + 5)),
      infosys: Math.round(Math.min(100, readinessScore)),
      wipro: Math.round(Math.min(100, readinessScore - 3)),
      accenture: Math.round(Math.min(100, readinessScore + 2))
    };

    const prediction = db.upsert("predictions", { userId }, {
      cgpa,
      readinessScore,
      companies
    });

    res.json({
      _id: prediction._id,
      userId: prediction.userId,
      cgpa: prediction.cgpa,
      readinessScore: prediction.readinessScore,
      companies: prediction.companies
    });
  } catch (err) {
    console.error("Local calculate prediction error:", err);
    res.status(500).json({ message: "Server error predicting placement readiness profile" });
  }
};
