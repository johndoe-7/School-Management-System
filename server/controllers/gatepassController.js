const db = require("../config/db");
const QRCode = require("qrcode");

exports.createGatepass = async (req, res) => {
  const {
    student_id,
    accompany_type,
    out_date,
    out_time,
    purpose,
    document_url,
  } = req.body;
  const user = req.user;

  try {
    let request_status = "Pending";
    let approved_by = null;
    let approved_at = null;
    let created_by_staff_id = null;
    let created_by_student_id = null;

    if (user.role !== "student") {
      request_status = "Approved";
      approved_by = user.id;
      approved_at = new Date();
      created_by_staff_id = user.id;
    } else {
      created_by_student_id = user.id;
    }

    const [result] = await db.query(
      `INSERT INTO gate_passes 
      (student_id, accompany_type, out_date, out_time, purpose, document_url, request_status, approved_by, approved_at, created_by_staff_id, created_by_student_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        accompany_type,
        out_date,
        out_time,
        purpose,
        document_url,
        request_status,
        approved_by,
        approved_at,
        created_by_staff_id,
        created_by_student_id,
      ],
    );

    const gatepassId = result.insertId;

    const qrCode = await generateGatepassQR(student_id, gatepassId);

    res.status(201).json({
      success: true,
      message: "Gatepass created",
      gatepassId,
      request_status,
      qrCode,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGatepasses = async (req, res) => {
  const user = req.user;
  try {
    let query = `
      SELECT gp.*, s.first_name, s.last_name, s.enrollment_number,
             st.first_name as approver_first_name, st.last_name as approver_last_name
      FROM gate_passes gp
      JOIN students s ON gp.student_id = s.id
      LEFT JOIN staff st ON gp.approved_by = st.id
    `;
    const params = [];

    if (user.role === "student") {
      query += " WHERE gp.student_id = ?";
      params.push(user.id);
    } else {
      query += " WHERE s.school_id = ?";
      params.push(user.school_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGatepassById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT gp.*, s.first_name, s.last_name, s.enrollment_number 
       FROM gate_passes gp 
       JOIN students s ON gp.student_id = s.id 
       WHERE gp.id = ?`,
      [id],
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Gatepass not found" });

    const gatepass = rows[0];
    const qrCode = await generateGatepassQR(gatepass.student_id, gatepass.id);

    res.json({ ...gatepass, qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { request_status, remarks } = req.body;
  const user = req.user;

  if (user.role === "student") {
    return res.status(403).json({ error: "Only staff can update status" });
  }

  try {
    const approved_at = request_status === "Approved" ? new Date() : null;
    await db.query(
      `UPDATE gate_passes 
       SET request_status = ?, remarks = ?, approved_by = ?, approved_at = ?, updated_by_staff_id = ? 
       WHERE id = ?`,
      [request_status, remarks, user.id, approved_at, user.id, id],
    );

    res.json({
      message: `Gatepass ${request_status.toLowerCase()} successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function generateGatepassQR(studentId, gatepassId) {
  const [rows] = await db.query(
    `SELECT s.id as student_id, s.first_name, s.last_name, s.enrollment_number, 
            mc.name as class_name, sec.name as section_name, b.batch_name,
            sch.name as school_name
     FROM students s
     JOIN schools sch ON s.school_id = sch.id
     LEFT JOIN batches b ON s.batch_id = b.id
     LEFT JOIN school_classes sc ON b.school_class_id = sc.id
     LEFT JOIN master_classes mc ON sc.master_class_id = mc.id
     LEFT JOIN sections sec ON b.section_id = sec.id
     WHERE s.id = ?`,
    [studentId],
  );

  const studentData = rows[0] || { student_id: studentId };
  const qrContent = JSON.stringify({
    type: "GATEPASS",
    gatepass_id: gatepassId,
    student: studentData,
    generated_at: new Date(),
  });

  return await QRCode.toDataURL(qrContent);
}
