import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const portal = searchParams.get("portal");

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(portal === "student" ? "student" : "staff");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [schools, setSchools] = useState([]);

  const { login } = useAuth();

  useEffect(() => {
    api.get("/schools").then((res) => setSchools(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await api.post("/auth/register", {
          email,
          password,
          role: role === "staff" ? "teacher" : "student",
          first_name: firstName,
          last_name: lastName,
          school_id: schoolId,
          enrollment_number: enrollmentNumber,
        });
        toast.success("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        const res = await api.post("/auth/login", { email, password, role });
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.first_name}!`);

        if (res.data.user.role === "student") {
          navigate("/student-dashboard");
        } else if (res.data.user.role === "super_admin") {
          navigate("/super-admin");
        } else {
          navigate("/school-admin");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed");
    }
  };

  return (
    <div
      className="animate-in"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg-secondary)",
        padding: "4rem 2rem",
        overflowY: "auto",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "3.5rem",
          border: "1px solid #000",
          background: "#fff",
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "3rem" }}>
          <h1
            className="page-title"
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            EduManage {isRegister ? "/ Register" : "/ Login"}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 500,
              marginTop: "0.5rem",
            }}
          >
            {isRegister
              ? "Join the educational platform"
              : "Access your workspace"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: "2rem" }}>
            <label className="input-label">Identity</label>
            <div
              style={{
                display: "flex",
                border: "1px solid #000",
                height: "3.5rem",
              }}
            >
              <button
                type="button"
                className={role === "staff" ? "btn-primary" : "btn-secondary"}
                style={{
                  flex: 1,
                  border: "none",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
                onClick={() => setRole("staff")}
              >
                Staff
              </button>
              <button
                type="button"
                className={role === "student" ? "btn-primary" : "btn-secondary"}
                style={{
                  flex: 1,
                  border: "none",
                  borderLeft: "1px solid #000",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
                onClick={() => setRole("student")}
              >
                Student
              </button>
            </div>
          </div>

          {isRegister && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              >
                <div className="input-group" style={{ minWidth: 0 }}>
                  <label className="input-label">First Name</label>
                  <input
                    className="input-field"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group" style={{ minWidth: 0 }}>
                  <label className="input-label">Last Name</label>
                  <input
                    className="input-field"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">School Branch</label>
                <select
                  className="input-field"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  required
                >
                  <option value="">Select School</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {role === "student" && (
                <div className="input-group">
                  <label className="input-label">Enrollment Number</label>
                  <input
                    className="input-field"
                    value={enrollmentNumber}
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn-primary"
            type="submit"
            style={{ width: "100%", marginTop: "1.5rem", height: "3.5rem" }}
          >
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "0.75rem",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
