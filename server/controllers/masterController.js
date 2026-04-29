const db = require("../config/db");

exports.getAllMasterClasses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM master_classes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMasterClass = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO master_classes (name) VALUES (?)",
      [name],
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Class already exists" });
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMasterMediums = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM master_mediums");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMasterMedium = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO master_mediums (name) VALUES (?)",
      [name],
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Medium already exists" });
    res.status(500).json({ error: err.message });
  }
};
