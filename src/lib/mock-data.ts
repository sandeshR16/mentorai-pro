// Realistic demo data for MentorAI

export const skillRadarData = [
  { skill: "DSA", value: 92, benchmark: 78 },
  { skill: "System Design", value: 74, benchmark: 70 },
  { skill: "Frontend", value: 88, benchmark: 65 },
  { skill: "Backend", value: 80, benchmark: 72 },
  { skill: "DevOps", value: 58, benchmark: 60 },
  { skill: "Communication", value: 81, benchmark: 75 },
];

export const weeklyActivity = [
  { day: "Mon", problems: 8, interviews: 1, xp: 320 },
  { day: "Tue", problems: 12, interviews: 0, xp: 410 },
  { day: "Wed", problems: 6, interviews: 2, xp: 580 },
  { day: "Thu", problems: 14, interviews: 1, xp: 620 },
  { day: "Fri", problems: 9, interviews: 1, xp: 440 },
  { day: "Sat", problems: 18, interviews: 2, xp: 780 },
  { day: "Sun", problems: 11, interviews: 1, xp: 510 },
];

export const placementProbability = [
  { name: "Google", value: 78 },
  { name: "Microsoft", value: 86 },
  { name: "Amazon", value: 82 },
  { name: "Meta", value: 64 },
  { name: "Adobe", value: 91 },
  { name: "Atlassian", value: 88 },
];

export const learningPaths = [
  { id: "1", title: "Advanced System Design Patterns", progress: 64, total: 12, done: 8, tag: "Google L4 Prep", color: "primary" },
  { id: "2", title: "Distributed Data Stores", progress: 42, total: 10, done: 4, tag: "Backend Track", color: "secondary" },
  { id: "3", title: "Dynamic Programming Mastery", progress: 88, total: 24, done: 21, tag: "DSA Elite", color: "accent" },
  { id: "4", title: "Behavioral Interview Mastery", progress: 30, total: 8, done: 2, tag: "Soft Skills", color: "primary" },
];

export const recentActivities = [
  { id: "1", type: "interview", title: "System Design Mock with AI", time: "2h ago", score: 82 },
  { id: "2", type: "lesson", title: "Completed: Kafka Consumer Groups", time: "5h ago", score: null },
  { id: "3", type: "problem", title: "Solved: Word Ladder II (Hard)", time: "Yesterday", score: null },
  { id: "4", type: "badge", title: "Earned: 14-Day Streak", time: "Yesterday", score: null },
  { id: "5", type: "interview", title: "HR Round with AI Mentor", time: "2d ago", score: 91 },
];

export const upcomingSessions = [
  { id: "1", title: "Google L4 Mock Interview", time: "Today, 4:00 PM", type: "Technical" },
  { id: "2", title: "Resume Review with Mentor", time: "Tomorrow, 11:00 AM", type: "Career" },
  { id: "3", title: "DSA Group Session", time: "Wed, 6:30 PM", type: "Study Group" },
];

export const leaderboard = [
  { rank: 1, name: "Aarav Mehta", college: "IIT Bombay", xp: 24820, streak: 89, change: 0 },
  { rank: 2, name: "Priya Reddy", college: "BITS Pilani", xp: 22140, streak: 76, change: 1 },
  { rank: 3, name: "Karan Shah", college: "NIT Trichy", xp: 21680, streak: 64, change: -1 },
  { rank: 4, name: "Ishita Verma", college: "IIIT Hyderabad", xp: 19920, streak: 52, change: 2 },
  { rank: 5, name: "You", college: "IIT Bombay", xp: 18420, streak: 14, change: 3, isYou: true },
  { rank: 6, name: "Rohan Kapoor", college: "VIT Vellore", xp: 17800, streak: 21, change: -2 },
  { rank: 7, name: "Sneha Iyer", college: "DTU Delhi", xp: 16450, streak: 33, change: 0 },
  { rank: 8, name: "Aditya Joshi", college: "IIT Madras", xp: 15920, streak: 18, change: 1 },
];

export const badges = [
  { id: "1", name: "Streak Master", desc: "14-day learning streak", icon: "🔥", earned: true, rarity: "rare" },
  { id: "2", name: "Algorithm Ace", desc: "Solved 100 DSA problems", icon: "⚡", earned: true, rarity: "epic" },
  { id: "3", name: "Mock Champion", desc: "20+ mock interviews", icon: "🎯", earned: true, rarity: "rare" },
  { id: "4", name: "System Architect", desc: "Complete system design path", icon: "🏛️", earned: false, rarity: "legendary" },
  { id: "5", name: "Code Reviewer", desc: "Helped 10 peers", icon: "🤝", earned: true, rarity: "common" },
  { id: "6", name: "Tier-1 Ready", desc: "FAANG-eligible score", icon: "👑", earned: false, rarity: "legendary" },
];

export const collegeMetrics = [
  { name: "IIT Bombay", students: 1240, placed: 1156, rate: 93, avgCTC: 28.4 },
  { name: "BITS Pilani", students: 980, placed: 872, rate: 89, avgCTC: 24.1 },
  { name: "NIT Trichy", students: 720, placed: 612, rate: 85, avgCTC: 19.8 },
  { name: "IIIT Hyderabad", students: 540, placed: 491, rate: 91, avgCTC: 26.2 },
  { name: "VIT Vellore", students: 1820, placed: 1488, rate: 82, avgCTC: 14.6 },
];

export const placementTrend = [
  { month: "Jul", rate: 71, offers: 142 },
  { month: "Aug", rate: 74, offers: 198 },
  { month: "Sep", rate: 79, offers: 264 },
  { month: "Oct", rate: 83, offers: 312 },
  { month: "Nov", rate: 88, offers: 401 },
  { month: "Dec", rate: 92, offers: 478 },
];

export const roadmap = [
  {
    phase: "Foundation",
    status: "completed",
    timeline: "Jan – Mar 2024",
    milestones: ["DSA Fundamentals", "OOP in Java", "Git & CI Basics", "MIT 6.006 Cert"],
  },
  {
    phase: "System Design Intensive",
    status: "active",
    timeline: "Apr – Jun 2024",
    milestones: ["Load Balancers", "Caching Strategies", "Database Sharding", "3 AI Sessions/wk"],
  },
  {
    phase: "Mock Interview Gauntlet",
    status: "upcoming",
    timeline: "Jul – Aug 2024",
    milestones: ["10 FAANG mocks", "Behavioral Drills", "Resume v3.0", "Offer Negotiation"],
  },
  {
    phase: "Placement Season",
    status: "upcoming",
    timeline: "Sep – Nov 2024",
    milestones: ["Google L4", "Microsoft SDE-I", "Stripe NG", "Sign Offer"],
  },
];

export const mentorPrompts = [
  "Generate a personalized roadmap for Google SWE",
  "Review my resume for backend roles",
  "Quiz me on distributed systems",
  "Compare my profile to last year's IIT placed students",
  "What's my weakest area for FAANG interviews?",
];

export const interviewQuestions = {
  technical: [
    "Design a URL shortener like bit.ly that handles 100M requests/day",
    "Implement an LRU cache with O(1) operations",
    "Explain the difference between optimistic and pessimistic locking",
  ],
  hr: [
    "Tell me about a time you handled conflict on a team",
    "Why do you want to work at our company?",
    "Where do you see yourself in 5 years?",
  ],
  company: [
    "Google: How would you design YouTube's recommendation engine?",
    "Meta: Build a news feed ranking system",
    "Stripe: Design an idempotent payments API",
  ],
};
