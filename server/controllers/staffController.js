const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getStaff = async (req, res) => {
  const { school_id } = req.query;
  try {
    let query =
      "SELECT id, school_id, first_name, last_name, email, role, created_at FROM staff";
    const params = [];
    if (school_id) {
      query += " WHERE school_id = ?";
      params.push(school_id);
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStaff = async (req, res) => {
  const { school_id, first_name, last_name, email, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO staff (school_id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)",
      [school_id || null, first_name, last_name, email, password_hash, role],
    );
    res
      .status(201)
      .json({ id: result.insertId, first_name, last_name, email, role });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Email already exists" });
    res.status(500).json({ error: err.message });
  }
};

exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, role } = req.body;
  try {
    await db.query(
      "UPDATE staff SET first_name = ?, last_name = ?, role = ? WHERE id = ?",
      [first_name, last_name, role, id],
    );
    res.json({ message: "Staff updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM staff WHERE id = ?", [id]);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
