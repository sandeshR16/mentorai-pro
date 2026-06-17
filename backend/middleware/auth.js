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
    req.user = { id: "66708dc2cb4e92bb3c8c7f99" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mentorai123");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token"
    });
  }
};
