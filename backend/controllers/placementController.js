const PlacementPrediction = require("../models/PlacementPrediction");
const Skill = require("../models/Skill");

exports.getLatestPrediction = async (req, res) => {
  try {
    let prediction = await PlacementPrediction.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!prediction) {
      // Lazy calculation using active student skill profile
      const skills = await Skill.findOne({ userId: req.user.id });
      const coding = skills ? skills.coding : 50;
      const aptitude = skills ? skills.aptitude : 50;
      const communication = skills ? skills.communication : 50;
      const cgpa = 7.5; // default baseline CGPA

      const readinessScore = Math.round(
        cgpa * 10 * 0.30 +
        coding * 0.30 +
        aptitude * 0.20 +
        communication * 0.20
      );

      prediction = await PlacementPrediction.create({
        userId: req.user.id,
        cgpa,
        coding,
        aptitude,
        communication,
        readinessScore,
        companies: {
          tcs: Math.round(Math.min(100, readinessScore + 5)),
          infosys: Math.round(Math.min(100, readinessScore)),
          wipro: Math.round(Math.min(100, readinessScore - 3)),
          accenture: Math.round(Math.min(100, readinessScore + 2))
        }
      });
    }

    res.json(prediction);
  } catch (err) {
    console.error("Fetch latest prediction error:", err);
    res.status(500).json({ message: "Server error fetching latest prediction" });
  }
};

exports.predictPlacement = async (req, res) => {
  try {
    const { cgpa, coding, aptitude, communication } = req.body;

    if (cgpa === undefined || coding === undefined || aptitude === undefined || communication === undefined) {
      return res.status(400).json({ message: "Missing required placement attributes" });
    }

    const readinessScore = Math.round(
      cgpa * 10 * 0.30 +
      coding * 0.30 +
      aptitude * 0.20 +
      communication * 0.20
    );

    const tcs = Math.round(Math.min(100, readinessScore + 5));
    const infosys = Math.round(Math.min(100, readinessScore));
    const wipro = Math.round(Math.min(100, readinessScore - 3));
    const accenture = Math.round(Math.min(100, readinessScore + 2));

    const prediction = await PlacementPrediction.create({
      userId: req.user.id,
      cgpa,
      coding,
      aptitude,
      communication,
      readinessScore,
      companies: {
        tcs,
        infosys,
        wipro,
        accenture
      }
    });

    res.json(prediction);
  } catch (err) {
    console.error("Predict placement error:", err);
    res.status(500).json({ message: "Server error calculating placement prediction" });
  }
};
