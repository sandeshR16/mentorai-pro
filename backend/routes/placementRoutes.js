const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { predictPlacement, getLatestPrediction } = require("../controllers/placementController");

router.post("/predict", auth, predictPlacement);
router.get("/latest", auth, getLatestPrediction);

module.exports = router;
