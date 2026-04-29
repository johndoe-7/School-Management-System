const db = require("../config/db");

exports.getAllSchools = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM schools");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSchool = async (req, res) => {
  const { name, address } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO schools (name, address) VALUES (?, ?)",
      [name, address],
    );
    res.status(201).json({ id: result.insertId, name, address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  try {
    await db.query("UPDATE schools SET name = ?, address = ? WHERE id = ?", [
      name,
      address,
      id,
    ]);
    res.json({ message: "School updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSchool = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM schools WHERE id = ?", [id]);
    res.json({ message: "School deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
