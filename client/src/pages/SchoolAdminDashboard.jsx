import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import StudentManagement from "../components/StudentManagement";
import ExamManagement from "../components/ExamManagement";
import GatepassManagement from "../components/GatepassManagement";
import { useAuth } from "../context/AuthContext";

export default function SchoolAdminDashboard() {
  const { user } = useAuth();
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    user?.school_id || localStorage.getItem("selectedSchoolId") || "",
  );
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") || "parameters",
  );

  useEffect(() => {
    localStorage.setItem("selectedSchoolId", selectedSchoolId);
  }, [selectedSchoolId]);

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  const [masterClasses, setMasterClasses] = useState([]);
  const [masterMediums, setMasterMediums] = useState([]);

  const [schoolClasses, setSchoolClasses] = useState([]);
  const [schoolMediums, setSchoolMediums] = useState([]);
  const [sections, setSections] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [cfgClassId, setCfgClassId] = useState("");
  const [cfgMediumId, setCfgMediumId] = useState("");
  const [secName, setSecName] = useState("");
  const [shiftName, setShiftName] = useState("Morning");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [batchClassId, setBatchClassId] = useState("");
  const [batchSecId, setBatchSecId] = useState("");
  const [batchShiftId, setBatchShiftId] = useState("");
  const [batchAcademicYearId, setBatchAcademicYearId] = useState("");
  const [batchName, setBatchName] = useState("");

  const [ayName, setAyName] = useState("");
  const [ayStart, setAyStart] = useState("");
  const [ayEnd, setAyEnd] = useState("");

  const [staff, setStaff] = useState([]);
  const [staffForm, setStaffForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "teacher",
  });

  useEffect(() => {
    api.get("/schools").then((res) => setSchools(res.data));
    api.get("/master/classes").then((res) => setMasterClasses(res.data));
    api.get("/master/mediums").then((res) => setMasterMediums(res.data));
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!selectedSchoolId) return;
    const loadSchoolData = async () => {
      try {
        if (activeTab === "config") {
          const res = await api.get(
            `/school-admin/school-classes?school_id=${selectedSchoolId}`,
          );
          setSchoolClasses(res.data);
          const medRes = await api.get(
            `/school-admin/school-mediums?school_id=${selectedSchoolId}`,
          );
          setSchoolMediums(medRes.data);
        } else if (activeTab === "parameters") {
          const secRes = await api.get(
            `/school-admin/sections?school_id=${selectedSchoolId}`,
          );
          setSections(secRes.data);
          const shfRes = await api.get(
            `/school-admin/shifts?school_id=${selectedSchoolId}`,
          );
          setShifts(shfRes.data);
          const ayRes = await api.get(
            `/school-admin/academic-years?school_id=${selectedSchoolId}`,
          );
          setAcademicYears(ayRes.data);
        } else if (activeTab === "staff") {
          const staffRes = await api.get(
            `/staff?school_id=${selectedSchoolId}`,
          );
          setStaff(staffRes.data);
        } else if (activeTab === "batches") {
          const res = await api.get(
            `/school-admin/batches?school_id=${selectedSchoolId}`,
          );
          setBatches(res.data);
          api
            .get(`/school-admin/school-classes?school_id=${selectedSchoolId}`)
            .then((r) => setSchoolClasses(r.data));
          api
            .get(`/school-admin/sections?school_id=${selectedSchoolId}`)
            .then((r) => setSections(r.data));
          api
            .get(`/school-admin/shifts?school_id=${selectedSchoolId}`)
            .then((r) => setShifts(r.data));
          api
            .get(`/school-admin/academic-years?school_id=${selectedSchoolId}`)
            .then((r) => setAcademicYears(r.data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadSchoolData();
  }, [selectedSchoolId, activeTab, refreshKey]);

  const handleMapClass = async (e) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/school-classes", {
        school_id: selectedSchoolId,
        master_class_id: cfgClassId,
      });
      toast.success("Class mapped successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Mapping failed. Maybe already exists?",
      );
      console.log(err);
    }
  };

  const handleMapMedium = async (e) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/school-mediums", {
        school_id: selectedSchoolId,
        master_medium_id: cfgMediumId,
      });
      toast.success("Medium mapped successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Mapping failed. Maybe already exists?",
      );
      console.log(err);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/sections", {
        school_id: selectedSchoolId,
        name: secName,
      });
      setSecName("");
      toast.success("Section created successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/shifts", {
        school_id: selectedSchoolId,
        shift_name: shiftName,
        start_time: shiftStart,
        end_time: shiftEnd,
      });
      setShiftStart("");
      setShiftEnd("");
      toast.success("Shift timing created successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const handleCreateAcademicYear = async (e) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/academic-years", {
        school_id: selectedSchoolId,
        name: ayName,
        start_date: ayStart,
        end_date: ayEnd,
      });
      setAyName("");
      setAyStart("");
      setAyEnd("");
      toast.success("Academic Year created successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/batches", {
        school_class_id: batchClassId,
        section_id: batchSecId,
        shift_id: batchShiftId || null,
        academic_year_id: batchAcademicYearId,
        batch_name: batchName,
      });
      setBatchName("");
      toast.success("Batch generated successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.error || "Failed! Check Unique restrictions.",
      );
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post("/staff", {
        school_id: selectedSchoolId,
        ...staffForm,
      });
      toast.success("Staff added successfully!");
      setStaffForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "teacher",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to add staff.");
    }
  };

  if (!selectedSchoolId) {
    return (
      <div
        className="app-container animate-in"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div
          className="glass-panel"
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "3.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              boxShadow: "0 15px 30px -5px rgba(37, 99, 235, 0.3)",
            }}
          >
            <span style={{ fontSize: "2.5rem" }}>🏫</span>
          </div>
          <h1
            className="page-title"
            style={{ fontSize: "2.4rem", marginBottom: "1rem" }}
          >
            Branch Portal
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "2.5rem",
              lineHeight: 1.6,
            }}
          >
            Please select your authorized school branch to continue to the
            administration dashboard.
          </p>

          <div className="input-group" style={{ textAlign: "left" }}>
            <label className="input-label">Authorized School</label>
            <select
              className="input-field"
              style={{ width: "100%", height: "3.5rem", fontSize: "1.05rem" }}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSchoolId(val);
                if (val) {
                  const schoolName =
                    schools.find((s) => s.id == val)?.name || "School";
                  toast.success(`Accessing ${schoolName} Dashboard`);
                }
              }}
            >
              <option value="">-- Choose Branch --</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link
              to="/"
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              ← Return to Main Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0 1rem",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#000",
              borderRadius: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            🏛️
          </div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            AdminPanel
          </h2>
        </div>

        <div
          style={{
            background: "var(--bg-tertiary)",
            padding: "1.2rem",
            borderRadius: "0",
            marginBottom: "2rem",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              fontWeight: 800,
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            Branch context
          </div>
          <div
            style={{
              fontWeight: 700,
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            {schools.find((s) => s.id == selectedSchoolId)?.name}
          </div>
          <button
            onClick={() => {
              setSelectedSchoolId("");
              toast.info("Context cleared.");
            }}
            style={{
              background: "#000",
              border: "none",
              color: "#fff",
              fontSize: "0.7rem",
              padding: "0.4rem 0.75rem",
              borderRadius: "0",
              cursor: "pointer",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Switch
          </button>
        </div>

        <div className="sidebar-title">Main Dashboard</div>
        <button
          className={`sidebar-link ${activeTab === "gatepass" ? "active" : ""}`}
          onClick={() => setActiveTab("gatepass")}
        >
          <span>🚪</span> Gatepass Review
        </button>
        <button
          className={`sidebar-link ${activeTab === "exams" ? "active" : ""}`}
          onClick={() => setActiveTab("exams")}
        >
          <span>📝</span> Examinations
        </button>
        <button
          className={`sidebar-link ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <span>🎓</span> Students
        </button>
        <button
          className={`sidebar-link ${activeTab === "staff" ? "active" : ""}`}
          onClick={() => setActiveTab("staff")}
        >
          <span>👨‍🏫</span> Staff Directory
        </button>

        <div className="sidebar-title" style={{ marginTop: "1.5rem" }}>
          Structure
        </div>
        <button
          className={`sidebar-link ${activeTab === "batches" ? "active" : ""}`}
          onClick={() => setActiveTab("batches")}
        >
          <span>📦</span> Batch Generator
        </button>
        <button
          className={`sidebar-link ${activeTab === "parameters" ? "active" : ""}`}
          onClick={() => setActiveTab("parameters")}
        >
          <span>📐</span> Sections & Shifts
        </button>
        <button
          className={`sidebar-link ${activeTab === "config" ? "active" : ""}`}
          onClick={() => setActiveTab("config")}
        >
          <span>⚙️</span> Core Config
        </button>

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <Link
            to="/"
            className="sidebar-link"
            style={{
              background: "rgba(239, 68, 68, 0.05)",
              color: "#dc2626",
              borderRadius: "0",
              padding: "1rem",
            }}
          >
            <span>←</span> Exit Portal
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="page-title" style={{ margin: 0, fontSize: "2.2rem" }}>
            {activeTab === "config" && "Core Configuration"}
            {activeTab === "parameters" && "School Parameters"}
            {activeTab === "batches" && "Batch Generator"}
            {activeTab === "staff" && "Staff Directory"}
            {activeTab === "students" && "Student Directory"}
            {activeTab === "exams" && "Examinations"}
            {activeTab === "gatepass" && "Gatepass Review"}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "0.5rem",
              fontSize: "1.1rem",
            }}
          >
            {activeTab === "config" &&
              "Map class and mediums to your school branch"}
            {activeTab === "parameters" &&
              "Manage sections, shifts and academic calendars"}
            {activeTab === "batches" &&
              "Finalize batch groups for the current year"}
            {activeTab === "staff" &&
              "Manage access and roles for school personnel"}
            {activeTab === "students" &&
              "Track and manage student enrollment and records"}
            {activeTab === "exams" &&
              "Oversee examination schedules and marks entry"}
            {activeTab === "gatepass" &&
              "Approve or reject student leave requests"}
          </p>
        </div>

        {activeTab === "students" && (
          <StudentManagement selectedSchoolId={selectedSchoolId} />
        )}
        {activeTab === "exams" && (
          <ExamManagement selectedSchoolId={selectedSchoolId} />
        )}
        {activeTab === "gatepass" && <GatepassManagement />}

        {activeTab === "config" && (
          <div className="dashboard-grid">
            <div className="glass-panel">
              <h2 style={{ marginBottom: "1rem" }}>Map Master Class</h2>
              <form onSubmit={handleMapClass}>
                <div className="input-group">
                  <label className="input-label">Select Class</label>
                  <select
                    className="input-field"
                    value={cfgClassId}
                    onChange={(e) => setCfgClassId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Master Class --</option>
                    {masterClasses.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary" type="submit">
                  Add to School
                </button>
              </form>
            </div>
            <div className="glass-panel">
              <h2 style={{ marginBottom: "1rem" }}>
                Active Classes in this School
              </h2>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mapped Name</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolClasses.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>{c.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="glass-panel">
              <h2 style={{ marginBottom: "1rem" }}>Map Master Medium</h2>
              <form onSubmit={handleMapMedium}>
                <div className="input-group">
                  <label className="input-label">Select Medium</label>
                  <select
                    className="input-field"
                    value={cfgMediumId}
                    onChange={(e) => setCfgMediumId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Master Medium --</option>
                    {masterMediums.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary" type="submit">
                  Add to School
                </button>
              </form>
            </div>
            <div className="glass-panel">
              <h2 style={{ marginBottom: "1rem" }}>
                Active Mediums in this School
              </h2>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mapped Name</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolMediums.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>{c.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "parameters" && (
          <>
            <div className="dashboard-grid">
              <div className="glass-panel">
                <h2 style={{ marginBottom: "1rem" }}>Create Section</h2>
                <form
                  onSubmit={handleCreateSection}
                  style={{ marginBottom: "2rem" }}
                >
                  <div className="input-group">
                    <label className="input-label">Section Name</label>
                    <input
                      className="input-field"
                      placeholder="e.g. A, B, Ruby, Sapphire"
                      value={secName}
                      onChange={(e) => setSecName(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn-primary" type="submit">
                    Save Section
                  </button>
                </form>
                <h3
                  style={{ fontSize: "1rem", color: "var(--text-secondary)" }}
                >
                  Existing Sections
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginTop: "1rem",
                  }}
                >
                  {sections.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "var(--bg-tertiary)",
                        borderRadius: "20px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-panel">
                <h2 style={{ marginBottom: "1rem" }}>Create Shift Timing</h2>
                <form onSubmit={handleCreateShift}>
                  <div className="input-group">
                    <label className="input-label">Type</label>
                    <select
                      className="input-field"
                      value={shiftName}
                      onChange={(e) => setShiftName(e.target.value)}
                      required
                    >
                      <option value="Morning">Morning</option>
                      <option value="Noon">Noon</option>
                    </select>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label className="input-label">Start</label>
                      <input
                        type="time"
                        className="input-field"
                        style={{ width: "100%" }}
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="input-label">End</label>
                      <input
                        type="time"
                        className="input-field"
                        style={{ width: "100%" }}
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button className="btn-primary" type="submit">
                    Save Shift
                  </button>
                </form>
                <table className="glass-table" style={{ marginTop: "1.5rem" }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts.map((s) => (
                      <tr key={s.id}>
                        <td>{s.shift_name}</td>
                        <td>{s.start_time}</td>
                        <td>{s.end_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="dashboard-grid"
              style={{ gridTemplateColumns: "1fr", marginTop: "1.5rem" }}
            >
              <div
                className="glass-panel"
                style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
              >
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <h2 style={{ marginBottom: "1rem" }}>Create Academic Year</h2>
                  <form onSubmit={handleCreateAcademicYear}>
                    <div className="input-group">
                      <label className="input-label">Academic Year Name</label>
                      <input
                        className="input-field"
                        placeholder="e.g. 2024-2025"
                        value={ayName}
                        onChange={(e) => setAyName(e.target.value)}
                        required
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label className="input-label">Start Date</label>
                        <input
                          type="date"
                          className="input-field"
                          style={{ width: "100%" }}
                          value={ayStart}
                          onChange={(e) => setAyStart(e.target.value)}
                          required
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="input-label">End Date</label>
                        <input
                          type="date"
                          className="input-field"
                          style={{ width: "100%" }}
                          value={ayEnd}
                          onChange={(e) => setAyEnd(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      type="submit"
                      style={{ width: "100%" }}
                    >
                      Save Academic Year
                    </button>
                  </form>
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: "300px",
                    borderLeft: "1px solid var(--border-color)",
                    paddingLeft: "2rem",
                  }}
                >
                  <h2 style={{ marginBottom: "1rem" }}>
                    Configured Academic Years
                  </h2>
                  <div style={{ overflowX: "auto" }}>
                    <table className="glass-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Start</th>
                          <th>End</th>
                          <th>Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicYears.map((ay) => (
                          <tr key={ay.id}>
                            <td style={{ fontWeight: 500 }}>{ay.name}</td>
                            <td>
                              {ay.start_date ? ay.start_date.split("T")[0] : ""}
                            </td>
                            <td>
                              {ay.end_date ? ay.end_date.split("T")[0] : ""}
                            </td>
                            <td>
                              <span
                                style={{
                                  background: "var(--bg-primary)",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  color: "#60a5fa",
                                }}
                              >
                                {ay.total_days}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "batches" && (
          <div
            className="dashboard-grid"
            style={{ gridTemplateColumns: "1fr" }}
          >
            <div
              className="glass-panel"
              style={{ display: "flex", gap: "2rem" }}
            >
              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: "1.5rem" }}>Finalize New Batch</h2>
                <form onSubmit={handleCreateBatch}>
                  <div className="input-group">
                    <label className="input-label">Custom Batch Name</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Class 10th - Alpha Batch"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Select Target Class</label>
                    <select
                      className="input-field"
                      value={batchClassId}
                      onChange={(e) => setBatchClassId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Configured Class --</option>
                      {schoolClasses.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Assign Section</label>
                    <select
                      className="input-field"
                      value={batchSecId}
                      onChange={(e) => setBatchSecId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Section --</option>
                      {sections.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Link Shift (Optional)</label>
                    <select
                      className="input-field"
                      value={batchShiftId}
                      onChange={(e) => setBatchShiftId(e.target.value)}
                    >
                      <option value="">-- No Shift Bound --</option>
                      {shifts.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.shift_name} ({m.start_time})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Academic Year</label>
                    <select
                      className="input-field"
                      value={batchAcademicYearId}
                      onChange={(e) => setBatchAcademicYearId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Academic Year --</option>
                      {academicYears.map((ay) => (
                        <option key={ay.id} value={ay.id}>
                          {ay.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn-primary"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Generate System Batch
                  </button>
                </form>
              </div>

              <div
                style={{
                  flex: 1,
                  borderLeft: "1px solid var(--border-color)",
                  paddingLeft: "2rem",
                }}
              >
                <h2 style={{ marginBottom: "1.5rem" }}>
                  Created Batches Directory
                </h2>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {batches.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        background: "var(--bg-tertiary)",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <h3 style={{ fontSize: "1.2rem" }}>{b.batch_name}</h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span
                          style={{
                            background: "var(--bg-primary)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid var(--border-hover)",
                          }}
                        >
                          {b.class_name}
                        </span>
                        <span
                          style={{
                            background: "var(--bg-primary)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid var(--border-hover)",
                          }}
                        >
                          Sec: {b.section_name}
                        </span>
                        {b.shift_name && (
                          <span
                            style={{
                              background: "rgba(0,0,0,0.3)",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {b.shift_name}
                          </span>
                        )}
                        {b.academic_year_name && (
                          <span
                            style={{
                              background: "rgba(96, 165, 250, 0.2)",
                              color: "#60a5fa",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {b.academic_year_name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {batches.length === 0 && (
                    <p style={{ color: "var(--text-secondary)" }}>
                      No batches generated yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "staff" && (
          <div className="dashboard-grid">
            <div className="glass-panel">
              <h2 style={{ marginBottom: "1rem" }}>Add New Staff Member</h2>
              <form onSubmit={handleCreateStaff}>
                <div className="input-group">
                  <label className="input-label">First Name</label>
                  <input
                    className="input-field"
                    placeholder="John"
                    value={staffForm.first_name}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Last Name</label>
                  <input
                    className="input-field"
                    placeholder="Doe"
                    value={staffForm.last_name}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, last_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="john@school.com"
                    value={staffForm.email}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Secret Password"
                    value={staffForm.password}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Role</label>
                  <select
                    className="input-field"
                    value={staffForm.role}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, role: e.target.value })
                    }
                    required
                  >
                    <option value="school_admin">School Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="other_staff">Other Staff</option>
                  </select>
                </div>
                <button className="btn-primary" type="submit">
                  Create Staff
                </button>
              </form>
            </div>

            <div className="glass-panel">
              <h2 style={{ marginBottom: "1rem" }}>Staff Directory</h2>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s.id}>
                      <td>
                        {s.first_name} {s.last_name}
                      </td>
                      <td>{s.email}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {s.role.replace("_", " ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {staff.length === 0 && (
                <p
                  style={{ color: "var(--text-secondary)", marginTop: "1rem" }}
                >
                  No staff members registered for this school yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
