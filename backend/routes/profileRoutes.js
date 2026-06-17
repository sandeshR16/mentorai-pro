const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  updateSkills,
  addInterview
} = require("../controllers/profileController");

router.get("/me", auth, getProfile);
router.put("/update", auth, updateProfile);
router.post("/skills", auth, updateSkills);
router.post("/interviews", auth, addInterview);

module.exports = router;
