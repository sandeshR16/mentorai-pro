const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "No Token, authorization denied"
    });
  }

  // Handle Bearer token prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  // Accept mock tokens for offline/permissive testing
  if (token.startsWith("mock_")) {
    console.log("Mock token detected. Bypassing JWT verification.");
    req.user = { 
      id: "66708dc2cb4e92bb3c8c7f99",
      name: "Mock Student",
      email: "student@mentorai.com",
      branch: "Computer Science & Engineering",
      semester: 6
    };
    return next();
  }

  try {
    const secret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || "mentorai123";
    const decoded = jwt.verify(token, secret);
    
    req.user = {
      id: decoded.id || decoded.sub || "66708dc2cb4e92bb3c8c7f99",
      email: decoded.email || "student@mentorai.com",
      name: decoded.name || decoded.user_metadata?.name || decoded.user_metadata?.full_name || (decoded.email ? decoded.email.split("@")[0] : "Mock Student"),
      branch: decoded.branch || decoded.user_metadata?.branch || "Computer Science & Engineering",
      semester: Number(decoded.semester) || Number(decoded.user_metadata?.semester) || 6,
      ...decoded
    };
    next();
  } catch (err) {
    // Permissive fallback: check if standard local secret validates it (e.g. offline fallback tokens)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "mentorai123");
      req.user = {
        id: decoded.id || "66708dc2cb4e92bb3c8c7f99",
        email: decoded.email || "student@mentorai.com",
        name: decoded.name || "Mock Student",
        branch: decoded.branch || "Computer Science & Engineering",
        semester: Number(decoded.semester) || 6,
        ...decoded
      };
      next();
    } catch (fallbackErr) {
      res.status(401).json({
        message: "Invalid Token"
      });
    }
  }
};
