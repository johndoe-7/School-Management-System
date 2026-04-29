import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GatepassStudent from "../components/GatepassStudent";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            🎓
          </div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            EduPortal
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
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            Student Profile
          </div>
          <div
            style={{
              fontWeight: 700,
              color: "var(--text-primary)",
              fontSize: "1rem",
            }}
          >
            {user?.first_name} {user?.last_name}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginTop: "0.2rem",
            }}
          >
            ID: {user?.id} • {user?.role}
          </div>
        </div>

        <div className="sidebar-title">Menu</div>
        <button className="sidebar-link active">
          <span>🚪</span> Gatepass History
        </button>
        <button className="sidebar-link">
          <span>📚</span> My Courses
        </button>
        <button className="sidebar-link">
          <span>📅</span> Attendance
        </button>

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{
              width: "100%",
              background: "rgba(239, 68, 68, 0.05)",
              color: "#dc2626",
              borderRadius: "0",
              padding: "1rem",
            }}
          >
            <span>←</span> Sign Out
          </button>
        </div>
      </div>

      <div className="main-content">
        <GatepassStudent />
      </div>
    </div>
  );
}
