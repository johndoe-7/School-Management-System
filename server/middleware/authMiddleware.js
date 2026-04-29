const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.role === "student") {
      const [rows] = await db.query("SELECT id FROM students WHERE id = ?", [
        decoded.id,
      ]);
      if (rows.length === 0)
        return res.status(401).json({ error: "Invalid user." });
    } else {
      const [rows] = await db.query("SELECT id FROM staff WHERE id = ?", [
        decoded.id,
      ]);
      if (rows.length === 0)
        return res.status(401).json({ error: "Invalid user." });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const staffOnly = (req, res, next) => {
  if (req.user.role === "student") {
    return res.status(403).json({ error: "Access denied. Staff only." });
  }
  next();
};

const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Access denied. Students only." });
  }
  next();
};

module.exports = { authMiddleware, staffOnly, studentOnly };
