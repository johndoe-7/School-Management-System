const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role === "student") {
      const [rows] = await db.query("SELECT * FROM students WHERE email = ?", [
        email,
      ]);
      user = rows[0];
    } else {
      const [rows] = await db.query("SELECT * FROM staff WHERE email = ?", [
        email,
      ]);
      user = rows[0];
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role || "student",
        school_id: user.school_id,
        name: `${user.first_name} ${user.last_name}`,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role || "student",
        school_id: user.school_id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setStudentPassword = async (req, res) => {
  const { student_id, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    await db.query("UPDATE students SET password_hash = ? WHERE id = ?", [
      password_hash,
      student_id,
    ]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.register = async (req, res) => {
  const {
    email,
    password,
    role,
    first_name,
    last_name,
    school_id,
    enrollment_number,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    if (role === "student") {
      const [result] = await db.query(
        "INSERT INTO students (school_id, first_name, last_name, email, enrollment_number, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
        [
          school_id,
          first_name,
          last_name,
          email,
          enrollment_number,
          password_hash,
        ],
      );
      res
        .status(201)
        .json({
          id: result.insertId,
          email,
          first_name,
          last_name,
          role: "student",
        });
    } else {
      const [result] = await db.query(
        "INSERT INTO staff (school_id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)",
        [
          school_id,
          first_name,
          last_name,
          email,
          password_hash,
          role || "teacher",
        ],
      );
      res
        .status(201)
        .json({
          id: result.insertId,
          email,
          first_name,
          last_name,
          role: role || "teacher",
        });
    }
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Email or Enrollment Number already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};
