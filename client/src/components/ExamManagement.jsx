import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";

export default function ExamManagement({ selectedSchoolId }) {
  const [activeTab, setActiveTab] = useState("exams");
  const [refreshKey, setRefreshKey] = useState(0);

  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [grades, setGrades] = useState([]);
  const [examSubjects, setExamSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [resultSubjects, setResultSubjects] = useState([]);
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "" });
  const [examForm, setExamForm] = useState({
    academic_year_id: "",
    name: "",
    start_date: "",
    end_date: "",
  });
  const [gradeForm, setGradeForm] = useState({
    grade_name: "",
    min_percent: "",
    max_percent: "",
  });
  const [examSubjectForm, setExamSubjectForm] = useState({
    exam_id: "",
    subject_id: "",
    is_theory: true,
    is_practical: false,
    max_theory_marks: 100,
    max_practical_marks: 0,
  });
  const [marksSelection, setMarksSelection] = useState({
    exam_id: "",
    subject_id: "",
  });
  const [resultsSelection, setResultsSelection] = useState({ exam_id: "" });

  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    if (!selectedSchoolId) return;
    api
      .get(`/school-admin/academic-years?school_id=${selectedSchoolId}`)
      .then((res) => setAcademicYears(res.data));
    api
      .get(`/exams/subjects/${selectedSchoolId}`)
      .then((res) => setSubjects(res.data.subjects || []));
    api
      .get(`/exams/${selectedSchoolId}`)
      .then((res) => setExams(res.data.exams || []));
    api
      .get(`/exams/grades/${selectedSchoolId}`)
      .then((res) => setGrades(res.data.grades || []));
    api
      .get(`/school-admin/students?school_id=${selectedSchoolId}`)
      .then((res) => setStudents(res.data || []));
  }, [selectedSchoolId, refreshKey]);

  useEffect(() => {
    if (marksSelection.exam_id) {
      api
        .get(`/exams/exam-subjects/${marksSelection.exam_id}`)
        .then((res) => setExamSubjects(res.data.examSubjects || []));
    }
  }, [marksSelection.exam_id, refreshKey]);

  useEffect(() => {
    if (marksSelection.exam_id && marksSelection.subject_id) {
      api
        .get(
          `/exams/marks/${marksSelection.exam_id}/${marksSelection.subject_id}`,
        )
        .then((res) => {
          const loadedMarks = {};
          res.data.marks.forEach((m) => {
            loadedMarks[m.student_id] = {
              theory: m.theory_marks,
              practical: m.practical_marks,
            };
          });
          setMarksData(loadedMarks);
        });
    }
  }, [marksSelection.exam_id, marksSelection.subject_id, refreshKey]);

  useEffect(() => {
    if (resultsSelection.exam_id) {
      api
        .get(`/exams/results/detailed/${resultsSelection.exam_id}`)
        .then((res) => {
          setExamResults(res.data.results || []);
          setResultSubjects(res.data.subjects || []);
        });
    }
  }, [resultsSelection.exam_id, refreshKey]);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams/subjects", {
        school_id: selectedSchoolId,
        ...subjectForm,
      });
      toast.success("Subject created");
      setSubjectForm({ name: "", code: "" });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create subject");
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams", { school_id: selectedSchoolId, ...examForm });
      toast.success("Exam created");
      setExamForm({
        academic_year_id: "",
        name: "",
        start_date: "",
        end_date: "",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create exam");
    }
  };

  const handleCreateGrade = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams/grades", {
        school_id: selectedSchoolId,
        ...gradeForm,
      });
      toast.success("Grade created");
      setGradeForm({ grade_name: "", min_percent: "", max_percent: "" });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create grade");
    }
  };

  const handleConfigureExamSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams/exam-subjects", examSubjectForm);
      toast.success("Exam Subject configured");
      setExamSubjectForm({ ...examSubjectForm, subject_id: "" });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to configure exam subject. Maybe already added?");
    }
  };

  const handleSaveMarks = async (studentId) => {
    try {
      const data = marksData[studentId] || { theory: 0, practical: 0 };
      await api.post("/exams/marks", {
        exam_id: marksSelection.exam_id,
        subject_id: marksSelection.subject_id,
        student_id: studentId,
        theory_marks: data.theory || 0,
        practical_marks: data.practical || 0,
      });
      toast.success("Marks saved and result updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save marks");
    }
  };

  const handleMarksChange = (studentId, type, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value,
      },
    }));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginBottom: "3rem",
          overflowX: "auto",
          padding: "0.5rem",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {["exams", "subjects", "config", "grades", "marks", "results"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "none",
                background:
                  activeTab === tab ? "rgba(37, 99, 235, 0.1)" : "transparent",
                color: activeTab === tab ? "#3b82f6" : "var(--text-secondary)",
                cursor: "pointer",
                textTransform: "capitalize",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
              }}
            >
              {tab === "config" ? "Exam Setup" : tab}
            </button>
          ),
        )}
      </div>

      {activeTab === "exams" && (
        <div className="dashboard-grid">
          <div className="glass-panel">
            <h2 style={{ marginBottom: "1rem" }}>Create New Exam</h2>
            <form onSubmit={handleCreateExam}>
              <div className="input-group">
                <label className="input-label">Exam Name</label>
                <input
                  className="input-field"
                  value={examForm.name}
                  onChange={(e) =>
                    setExamForm({ ...examForm, name: e.target.value })
                  }
                  required
                  placeholder="e.g. Mid Term 2024"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Academic Year</label>
                <select
                  className="input-field"
                  value={examForm.academic_year_id}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      academic_year_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Select Year --</option>
                  {academicYears.map((ay) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={examForm.start_date}
                    onChange={(e) =>
                      setExamForm({ ...examForm, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={examForm.end_date}
                    onChange={(e) =>
                      setExamForm({ ...examForm, end_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                className="btn-primary"
                type="submit"
                style={{ width: "100%" }}
              >
                Create Exam
              </button>
            </form>
          </div>
          <div className="glass-panel">
            <h2 style={{ marginBottom: "1rem" }}>Exams List</h2>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e) => (
                  <tr key={e.id}>
                    <td>{e.name}</td>
                    <td>{e.start_date?.split("T")[0]}</td>
                    <td>{e.end_date?.split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "subjects" && (
        <div className="dashboard-grid">
          <div className="glass-panel">
            <h2 style={{ marginBottom: "1rem" }}>Add Master Subject</h2>
            <form onSubmit={handleCreateSubject}>
              <div className="input-group">
                <label className="input-label">Subject Name</label>
                <input
                  className="input-field"
                  value={subjectForm.name}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, name: e.target.value })
                  }
                  required
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Subject Code (Optional)</label>
                <input
                  className="input-field"
                  value={subjectForm.code}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, code: e.target.value })
                  }
                  placeholder="e.g. MTH101"
                />
              </div>
              <button
                className="btn-primary"
                type="submit"
                style={{ width: "100%" }}
              >
                Add Subject
              </button>
            </form>
          </div>
          <div className="glass-panel">
            <h2 style={{ marginBottom: "1rem" }}>Master Subjects</h2>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s.id}>
                    <td>{s.code || "-"}</td>
                    <td>{s.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "config" && (
        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div
            className="glass-panel"
            style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
          >
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h2 style={{ marginBottom: "1rem" }}>Configure Exam Subjects</h2>
              <form onSubmit={handleConfigureExamSubject}>
                <div className="input-group">
                  <label className="input-label">Select Exam</label>
                  <select
                    className="input-field"
                    value={examSubjectForm.exam_id}
                    onChange={(e) => {
                      setExamSubjectForm({
                        ...examSubjectForm,
                        exam_id: e.target.value,
                      });
                      setMarksSelection({
                        ...marksSelection,
                        exam_id: e.target.value,
                      }); // sync for preview
                    }}
                    required
                  >
                    <option value="">-- Choose Exam --</option>
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Select Subject</label>
                  <select
                    className="input-field"
                    value={examSubjectForm.subject_id}
                    onChange={(e) =>
                      setExamSubjectForm({
                        ...examSubjectForm,
                        subject_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={examSubjectForm.is_theory}
                      onChange={(e) =>
                        setExamSubjectForm({
                          ...examSubjectForm,
                          is_theory: e.target.checked,
                        })
                      }
                    />{" "}
                    Theory
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={examSubjectForm.is_practical}
                      onChange={(e) =>
                        setExamSubjectForm({
                          ...examSubjectForm,
                          is_practical: e.target.checked,
                        })
                      }
                    />{" "}
                    Practical
                  </label>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Max Theory Marks</label>
                    <input
                      type="number"
                      className="input-field"
                      value={examSubjectForm.max_theory_marks}
                      onChange={(e) =>
                        setExamSubjectForm({
                          ...examSubjectForm,
                          max_theory_marks: e.target.value,
                        })
                      }
                      disabled={!examSubjectForm.is_theory}
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Max Practical Marks</label>
                    <input
                      type="number"
                      className="input-field"
                      value={examSubjectForm.max_practical_marks}
                      onChange={(e) =>
                        setExamSubjectForm({
                          ...examSubjectForm,
                          max_practical_marks: e.target.value,
                        })
                      }
                      disabled={!examSubjectForm.is_practical}
                    />
                  </div>
                </div>
                <button
                  className="btn-primary"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Map Subject to Exam
                </button>
              </form>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: "300px",
                borderLeft: "1px solid var(--border-color)",
                paddingLeft: "1rem",
              }}
            >
              <h2 style={{ marginBottom: "1rem" }}>
                Subjects in Selected Exam
              </h2>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Theory Max</th>
                    <th>Prac Max</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {examSubjects.map((es) => (
                    <tr key={es.id}>
                      <td>{es.subject_name}</td>
                      <td>{es.is_theory ? es.max_theory_marks : "-"}</td>
                      <td>{es.is_practical ? es.max_practical_marks : "-"}</td>
                      <td style={{ fontWeight: "bold", color: "#60a5fa" }}>
                        {es.total_max_marks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "grades" && (
        <div className="dashboard-grid">
          <div className="glass-panel">
            <h2 style={{ marginBottom: "1rem" }}>Add Grading Scale</h2>
            <form onSubmit={handleCreateGrade}>
              <div className="input-group">
                <label className="input-label">Grade Name</label>
                <input
                  className="input-field"
                  value={gradeForm.grade_name}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, grade_name: e.target.value })
                  }
                  required
                  placeholder="e.g. A+"
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Min %</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={gradeForm.min_percent}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        min_percent: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Max %</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={gradeForm.max_percent}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        max_percent: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <button
                className="btn-primary"
                type="submit"
                style={{ width: "100%" }}
              >
                Add Grade
              </button>
            </form>
          </div>
          <div className="glass-panel">
            <h2 style={{ marginBottom: "1rem" }}>Grading System</h2>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Min %</th>
                  <th>Max %</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: "bold", color: "#60a5fa" }}>
                      {g.grade_name}
                    </td>
                    <td>{g.min_percent}%</td>
                    <td>{g.max_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "marks" && (
        <div className="glass-panel">
          <h2 style={{ marginBottom: "1rem" }}>Enter Student Marks</h2>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <select
              className="input-field"
              value={marksSelection.exam_id}
              onChange={(e) => {
                setMarksSelection({
                  ...marksSelection,
                  exam_id: e.target.value,
                  subject_id: "",
                });
                setMarksData({});
              }}
              style={{ flex: 1 }}
            >
              <option value="">-- Select Exam --</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={marksSelection.subject_id}
              onChange={(e) => {
                setMarksSelection({
                  ...marksSelection,
                  subject_id: e.target.value,
                });
                setMarksData({});
              }}
              style={{ flex: 1 }}
              disabled={!marksSelection.exam_id}
            >
              <option value="">-- Select Subject --</option>
              {examSubjects.map((es) => (
                <option key={es.subject_id} value={es.subject_id}>
                  {es.subject_name}
                </option>
              ))}
            </select>
          </div>

          {marksSelection.subject_id && (
            <div style={{ overflowX: "auto" }}>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Enrollment No.</th>
                    <th>Student Name</th>
                    <th>Theory Marks</th>
                    <th>Practical Marks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.enrollment_number}</td>
                      <td>
                        {s.first_name} {s.last_name}
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          className="input-field"
                          style={{ width: "100px", padding: "0.5rem" }}
                          value={marksData[s.id]?.theory || ""}
                          onChange={(e) =>
                            handleMarksChange(s.id, "theory", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          className="input-field"
                          style={{ width: "100px", padding: "0.5rem" }}
                          value={marksData[s.id]?.practical || ""}
                          onChange={(e) =>
                            handleMarksChange(s.id, "practical", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn-primary"
                          style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                          onClick={() => handleSaveMarks(s.id)}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "results" && (
        <div className="glass-panel">
          <h2 style={{ marginBottom: "1rem" }}>View Exam Results</h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <select
              className="input-field"
              value={resultsSelection.exam_id}
              onChange={(e) => setResultsSelection({ exam_id: e.target.value })}
              style={{ width: "300px" }}
            >
              <option value="">-- Select Exam --</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          {resultsSelection.exam_id && (
            <div style={{ overflowX: "auto" }}>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Enrollment No.</th>
                    <th>Student Name</th>
                    {resultSubjects.map((sub) => (
                      <th key={sub.subject_id}>{sub.subject_name}</th>
                    ))}
                    <th>Total Obtained</th>
                    <th>Total Max</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {examResults.map((r) => (
                    <tr key={r.id}>
                      <td>{r.enrollment_number}</td>
                      <td>
                        {r.first_name} {r.last_name}
                      </td>
                      {resultSubjects.map((sub) => (
                        <td key={sub.subject_id}>
                          <span style={{ fontSize: "0.9rem" }}>
                            {r.marks && r.marks[sub.subject_id]
                              ? r.marks[sub.subject_id].total
                              : "N/A"}
                          </span>
                        </td>
                      ))}
                      <td style={{ fontWeight: 500 }}>
                        {r.total_obtained_marks}
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        {r.total_max_marks}
                      </td>
                      <td>{r.percentage}%</td>
                      <td>
                        <span
                          style={{
                            background: r.grade
                              ? "rgba(96, 165, 250, 0.2)"
                              : "rgba(255, 255, 255, 0.05)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            color: r.grade
                              ? "#60a5fa"
                              : "var(--text-secondary)",
                            fontWeight: "bold",
                          }}
                        >
                          {r.grade || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {examResults.length === 0 && (
                    <tr>
                      <td
                        colSpan={6 + resultSubjects.length}
                        style={{
                          textAlign: "center",
                          color: "var(--text-secondary)",
                        }}
                      >
                        No results published for this exam.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
