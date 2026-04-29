import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";

export default function StudentManagement({ selectedSchoolId }) {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [studentForm, setStudentForm] = useState({
    first_name: "",
    last_name: "",
    enrollment_number: "",
    batch_id: "",
  });

  useEffect(() => {
    if (!selectedSchoolId) return;
    api
      .get(`/school-admin/batches?school_id=${selectedSchoolId}`)
      .then((res) => setBatches(res.data))
      .catch((err) => console.error(err));

    api
      .get(`/school-admin/students?school_id=${selectedSchoolId}`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, [selectedSchoolId, refreshKey]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/students", {
        school_id: selectedSchoolId,
        ...studentForm,
      });
      toast.success("Student added successfully!");
      setStudentForm({
        first_name: "",
        last_name: "",
        enrollment_number: "",
        batch_id: "",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add student.");
    }
  };

  return (
    <div
      className="dashboard-grid animate-in"
      style={{ gridTemplateColumns: "1.2fr 2fr", alignItems: "start" }}
    >
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Enroll Student</h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            fontSize: "0.95rem",
          }}
        >
          Register a new student to the current branch.
        </p>

        <form onSubmit={handleCreateStudent}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="input-group">
              <label className="input-label">First Name</label>
              <input
                className="input-field"
                placeholder="John"
                value={studentForm.first_name}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, first_name: e.target.value })
                }
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Last Name</label>
              <input
                className="input-field"
                placeholder="Doe"
                value={studentForm.last_name}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, last_name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Enrollment ID</label>
            <input
              className="input-field"
              placeholder="SCH-2024-001"
              value={studentForm.enrollment_number}
              onChange={(e) =>
                setStudentForm({
                  ...studentForm,
                  enrollment_number: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Academic Batch</label>
            <select
              className="input-field"
              value={studentForm.batch_id}
              onChange={(e) =>
                setStudentForm({ ...studentForm, batch_id: e.target.value })
              }
            >
              <option value="">-- No Assigned Batch --</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batch_name} ({b.academic_year_name})
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn-primary"
            type="submit"
            style={{
              width: "100%",
              height: "3.5rem",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
          >
            Add Student Profile
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "0.25rem" }}>Student Directory</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Total enrolled: {students.length}
            </p>
          </div>
          <button
            className="btn-secondary"
            style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
          >
            Export CSV
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Enrollment No.</th>
                <th>Full Name</th>
                <th>Batch Assignment</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {s.enrollment_number}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {s.first_name} {s.last_name}
                  </td>
                  <td>
                    {s.batch_name ? (
                      <span
                        style={{
                          background: "rgba(37, 99, 235, 0.05)",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "10px",
                          color: "#3b82f6",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        {s.batch_name}
                      </span>
                    ) : (
                      <span
                        style={{
                          background: "rgba(239, 68, 68, 0.05)",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "10px",
                          color: "#ef4444",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          border: "1px solid rgba(239, 68, 68, 0.1)",
                        }}
                      >
                        Unassigned
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "4rem",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    No students found in this branch directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
