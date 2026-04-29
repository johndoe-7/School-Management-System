import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import { useAuth } from "./context/AuthContext";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";

const Home = () => {
  useEffect(() => {
    toast("Welcome! Please select your authorized portal.", {
      id: "welcome-toast",
      icon: "🏫",
      style: {
        borderRadius: "0",
        background: "#000",
        color: "#fff",
      },
    });
  }, []);

  return (
    <div
      className="animate-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1
          className="page-title"
          style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          EduManage Pro
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          SELECT YOUR AUTHORIZED PORTAL
        </p>
      </div>

      <div
        className="dashboard-grid"
        style={{
          marginTop: 0,
          width: "100%",
          maxWidth: "1100px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <Link
          to="/login?portal=super_admin"
          className="glass-panel"
          style={{
            textDecoration: "none",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            border: "1px solid #000",
          }}
        >
          <div style={{ fontSize: "2rem" }}>👑</div>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Super Admin
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            GLOBAL CONTROL OVER MASTER ENTITIES, REGISTERED SCHOOLS, AND SYSTEM
            PARAMETERS.
          </p>
          <div
            className="btn-primary"
            style={{ marginTop: "auto", width: "fit-content" }}
          >
            Enter Portal
          </div>
        </Link>

        <Link
          to="/login?portal=school_admin"
          className="glass-panel"
          style={{
            textDecoration: "none",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            border: "1px solid #000",
          }}
        >
          <div style={{ fontSize: "2rem" }}>🏫</div>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            School Admin
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            MANAGE BRANCH CONFIGURATIONS, BATCH GENERATION, STAFF DIRECTORY, AND
            STUDENT RECORDS.
          </p>
          <div
            className="btn-primary"
            style={{ marginTop: "auto", width: "fit-content" }}
          >
            Enter Portal
          </div>
        </Link>

        <Link
          to="/login?portal=student"
          className="glass-panel"
          style={{
            textDecoration: "none",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            border: "1px solid #000",
          }}
        >
          <div style={{ fontSize: "2rem" }}>🎓</div>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Student Portal
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            ACCESS YOUR GATEPASS HISTORY, EXAMINATION RESULTS, AND ACADEMIC
            PROFILE.
          </p>
          <div
            className="btn-primary"
            style={{ marginTop: "auto", width: "fit-content" }}
          >
            Enter Portal
          </div>
        </Link>
      </div>
    </div>
  );
};

import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import StudentDashboard from "./pages/StudentDashboard";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role) &&
    user.role !== "super_admin"
  ) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          background: "var(--bg-primary)",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</h1>
        <h2 style={{ color: "var(--text-primary)", fontSize: "2rem" }}>
          Unauthorized Access
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginTop: "1rem",
            fontSize: "1.1rem",
          }}
        >
          You do not have permission to view this portal.
        </p>
        <Link
          to="/"
          className="btn-primary"
          style={{
            marginTop: "2rem",
            textDecoration: "none",
            padding: "0.8rem 2rem",
          }}
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 4000,
            style: {
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#333",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "1rem",
              fontFamily: "inherit",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/super-admin/*"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-admin/*"
            element={
              <ProtectedRoute allowedRoles={["teacher", "school_admin"]}>
                <SchoolAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
