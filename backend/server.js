require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const placementRoutes = require("./routes/placementRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");

// Initialize Database connection
connectDB();

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Main entry route for health checks
app.get("/", (req, res) => {
  res.json({ message: "Mentor AI API is running!" });
});

// Register routers
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/gamification", gamificationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
