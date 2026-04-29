const db = require("../config/db");

exports.createExam = async (req, res) => {
  const { school_id, academic_year_id, name, start_date, end_date } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO exams (school_id, academic_year_id, name, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
      [school_id, academic_year_id, name, start_date, end_date],
    );
    res
      .status(201)
      .json({ success: true, message: "Exam created", id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const [exams] = await db.query("SELECT * FROM exams WHERE school_id = ?", [
      req.params.schoolId,
    ]);
    res.status(200).json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  const { school_id, name, code } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO school_subjects (school_id, name, code) VALUES (?, ?, ?)",
      [school_id, name, code],
    );
    res
      .status(201)
      .json({ success: true, message: "Subject created", id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const [subjects] = await db.query(
      "SELECT * FROM school_subjects WHERE school_id = ?",
      [req.params.schoolId],
    );
    res.status(200).json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addExamSubject = async (req, res) => {
  const {
    exam_id,
    subject_id,
    is_theory,
    is_practical,
    max_theory_marks,
    max_practical_marks,
  } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO exam_subjects 
      (exam_id, subject_id, is_theory, is_practical, max_theory_marks, max_practical_marks) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        exam_id,
        subject_id,
        is_theory,
        is_practical,
        max_theory_marks,
        max_practical_marks,
      ],
    );
    res.status(201).json({
      success: true,
      message: "Exam Subject added",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getExamSubjects = async (req, res) => {
  try {
    const [examSubjects] = await db.query(
      `SELECT es.*, s.name as subject_name, s.code 
       FROM exam_subjects es 
       JOIN school_subjects s ON es.subject_id = s.id 
       WHERE es.exam_id = ?`,
      [req.params.examId],
    );
    res.status(200).json({ success: true, examSubjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createGrade = async (req, res) => {
  const { school_id, grade_name, min_percent, max_percent } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO grade_systems (school_id, grade_name, min_percent, max_percent) VALUES (?, ?, ?, ?)",
      [school_id, grade_name, min_percent, max_percent],
    );
    res
      .status(201)
      .json({ success: true, message: "Grade created", id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const [grades] = await db.query(
      "SELECT * FROM grade_systems WHERE school_id = ? ORDER BY max_percent DESC",
      [req.params.schoolId],
    );
    res.status(200).json({ success: true, grades });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.enterMarks = async (req, res) => {
  const { exam_id, subject_id, student_id, theory_marks, practical_marks } =
    req.body;
  try {
    await db.query(
      `INSERT INTO exam_marks (exam_id, subject_id, student_id, theory_marks, practical_marks)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       theory_marks = VALUES(theory_marks), 
       practical_marks = VALUES(practical_marks)`,
      [
        exam_id,
        subject_id,
        student_id,
        theory_marks || 0,
        practical_marks || 0,
      ],
    );

    const [marks] = await db.query(
      `SELECT em.total_marks as obtained, es.total_max_marks as max
       FROM exam_marks em
       JOIN exam_subjects es ON em.exam_id = es.exam_id AND em.subject_id = es.subject_id
       WHERE em.exam_id = ? AND em.student_id = ?`,
      [exam_id, student_id],
    );

    let totalObtained = 0;
    let totalMax = 0;
    marks.forEach((m) => {
      totalObtained += parseFloat(m.obtained);
      totalMax += parseFloat(m.max);
    });

    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    const [examRows] = await db.query(
      "SELECT school_id FROM exams WHERE id = ?",
      [exam_id],
    );
    const school_id = examRows[0]?.school_id;

    const [gradeRows] = await db.query(
      `SELECT grade_name FROM grade_systems 
       WHERE school_id = ? AND ? >= min_percent AND ? <= max_percent
       LIMIT 1`,
      [school_id, percentage, percentage],
    );
    const grade = gradeRows.length > 0 ? gradeRows[0].grade_name : null;

    await db.query(
      `INSERT INTO exam_results (exam_id, student_id, total_obtained_marks, total_max_marks, percentage, grade)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       total_obtained_marks = VALUES(total_obtained_marks),
       total_max_marks = VALUES(total_max_marks),
       percentage = VALUES(percentage),
       grade = VALUES(grade)`,
      [exam_id, student_id, totalObtained, totalMax, percentage, grade],
    );

    res.status(200).json({
      success: true,
      message: "Marks entered and results updated",
      result: { totalObtained, totalMax, percentage, grade },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getExamResults = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT er.*, s.first_name, s.last_name, s.enrollment_number 
       FROM exam_results er
       JOIN students s ON er.student_id = s.id
       WHERE er.exam_id = ?`,
      [req.params.examId],
    );
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const { examId, subjectId } = req.params;
    const [marks] = await db.query(
      "SELECT * FROM exam_marks WHERE exam_id = ? AND subject_id = ?",
      [examId, subjectId],
    );
    res.status(200).json({ success: true, marks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDetailedResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const [subjects] = await db.query(
      `SELECT es.subject_id, s.name as subject_name 
       FROM exam_subjects es 
       JOIN school_subjects s ON es.subject_id = s.id 
       WHERE es.exam_id = ?`,
      [examId],
    );

    const [results] = await db.query(
      `SELECT er.*, s.first_name, s.last_name, s.enrollment_number 
       FROM exam_results er
       JOIN students s ON er.student_id = s.id
       WHERE er.exam_id = ?`,
      [examId],
    );

    const [allMarks] = await db.query(
      `SELECT * FROM exam_marks WHERE exam_id = ?`,
      [examId],
    );
    const detailedResults = results.map((r) => {
      const studentMarks = {};
      allMarks
        .filter((m) => m.student_id === r.student_id)
        .forEach((m) => {
          studentMarks[m.subject_id] = {
            theory: m.theory_marks,
            practical: m.practical_marks,
            total: m.total_marks,
          };
        });
      return { ...r, marks: studentMarks };
    });

    res.status(200).json({ success: true, results: detailedResults, subjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
