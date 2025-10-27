const jwt = require("jsonwebtoken");
const User = require("../model/User.js");

const protect = async (req, res, next) => {
  let token;
  // Read token from Authorization header (expected: "Bearer <token>")
  const authHeader = req.headers.authorization;
  console.log("[authMiddleware] Authorization header:", authHeader);
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    console.log("[authMiddleware] No token found on request");
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[authMiddleware] decoded token:", decoded);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("[authMiddleware] No user found for id:", decoded.id);
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("[authMiddleware] token verification error:", err && err.message);
    console.log("[authMiddleware] JWT_SECRET is set:", !!process.env.JWT_SECRET);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
