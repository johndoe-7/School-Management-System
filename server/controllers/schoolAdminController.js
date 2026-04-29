const db = require("../config/db");

exports.getShifts = async (req, res) => {
  const { school_id } = req.query;
  try {
    const [rows] = await db.query("SELECT * FROM shifts WHERE school_id = ?", [
      school_id,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createShift = async (req, res) => {
  const { school_id, shift_name, start_time, end_time } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO shifts (school_id, shift_name, start_time, end_time) VALUES (?, ?, ?, ?)",
      [school_id, shift_name, start_time, end_time],
    );
    res.status(201).json({ id: result.insertId, school_id, shift_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSections = async (req, res) => {
  const { school_id } = req.query;
  try {
    const [rows] = await db.query(
      "SELECT * FROM sections WHERE school_id = ?",
      [school_id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSection = async (req, res) => {
  const { school_id, name } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO sections (school_id, name) VALUES (?, ?)",
      [school_id, name],
    );
    res.status(201).json({ id: result.insertId, school_id, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSchoolClasses = async (req, res) => {
  const { school_id } = req.query;
  try {
    const [rows] = await db.query(
      `
            SELECT sc.id, mc.name 
            FROM school_classes sc
            JOIN master_classes mc ON sc.master_class_id = mc.id
            WHERE sc.school_id = ?
        `,
      [school_id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSchoolClass = async (req, res) => {
  const { school_id, master_class_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO school_classes (school_id, master_class_id) VALUES (?, ?)",
      [school_id, master_class_id],
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBatches = async (req, res) => {
  const { school_id } = req.query;
  try {
    const [rows] = await db.query(
      `
            SELECT b.id, b.batch_name, mc.name as class_name, s.name as section_name, sh.shift_name, ay.name as academic_year_name, b.academic_year_id
            FROM batches b
            JOIN school_classes sc ON b.school_class_id = sc.id
            JOIN master_classes mc ON sc.master_class_id = mc.id
            JOIN sections s ON b.section_id = s.id
            LEFT JOIN shifts sh ON b.shift_id = sh.id
            LEFT JOIN academic_years ay ON b.academic_year_id = ay.id
            WHERE sc.school_id = ?
        `,
      [school_id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBatch = async (req, res) => {
  const {
    school_class_id,
    section_id,
    shift_id,
    academic_year_id,
    batch_name,
  } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO batches (school_class_id, section_id, shift_id, academic_year_id, batch_name) VALUES (?, ?, ?, ?, ?)",
      [
        school_class_id,
        section_id,
        shift_id || null,
        academic_year_id,
        batch_name,
      ],
    );
    res.status(201).json({ id: result.insertId, batch_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSchoolMediums = async (req, res) => {
  const { school_id } = req.query;
  try {
    const [rows] = await db.query(
      `
            SELECT sm.id, mm.name 
            FROM school_mediums sm
            JOIN master_mediums mm ON sm.master_medium_id = mm.id
            WHERE sm.school_id = ?
        `,
      [school_id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSchoolMedium = async (req, res) => {
  const { school_id, master_medium_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO school_mediums (school_id, master_medium_id) VALUES (?, ?)",
      [school_id, master_medium_id],
    );
    8;
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAcademicYears = async (req, res) => {
  const { school_id } = req.query;
  try {
    const [rows] = await db.query(
      "SELECT * FROM academic_years WHERE school_id = ?",
      [school_id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAcademicYear = async (req, res) => {
  const { school_id, name, start_date, end_date } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO academic_years (school_id, name, start_date, end_date) VALUES (?, ?, ?, ?)",
      [school_id, name, start_date, end_date],
    );
    res
      .status(201)
      .json({ id: result.insertId, school_id, name, start_date, end_date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudents = async (req, res) => {
  const { school_id } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT s.*, b.batch_name 
       FROM students s 
       LEFT JOIN batches b ON s.batch_id = b.id 
       WHERE s.school_id = ?`,
      [school_id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  const { school_id, batch_id, first_name, last_name, enrollment_number } =
    req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO students (school_id, batch_id, first_name, last_name, enrollment_number) VALUES (?, ?, ?, ?, ?)",
      [school_id, batch_id || null, first_name, last_name, enrollment_number],
    );
    res.status(201).json({ id: result.insertId, first_name, last_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
