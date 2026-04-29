import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("schools");

  const [schools, setSchools] = useState([]);
  const [masterClasses, setMasterClasses] = useState([]);
  const [masterMediums, setMasterMediums] = useState([]);

  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [editSchoolId, setEditSchoolId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "schools") {
          const { data } = await api.get("/schools");
          setSchools(data);
        } else if (activeTab === "classes") {
          const { data } = await api.get("/master/classes");
          setMasterClasses(data);
        } else if (activeTab === "mediums") {
          const { data } = await api.get("/master/mediums");
          setMasterMediums(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [activeTab, refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName) return;
    try {
      if (activeTab === "schools") {
        await api.post("/schools", { name: formName, address: formAddress });
      } else if (activeTab === "classes") {
        await api.post("/master/classes", { name: formName });
      } else if (activeTab === "mediums") {
        await api.post("/master/mediums", { name: formName });
      }
      setFormName("");
      setFormAddress("");
      toast.success(
        `${activeTab === "schools" ? "School" : activeTab === "classes" ? "Master Class" : "Master Medium"} added successfully!`,
      );
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteSchool = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;
    try {
      await api.delete(`/schools/${id}`);
      toast.success("School deleted successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleUpdateSchool = async (e, id) => {
    e.preventDefault();
    try {
      await api.put(`/schools/${id}`, { name: editName, address: editAddress });
      setEditSchoolId(null);
      toast.success("School updated successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
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
            👑
          </div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            SuperPanel
          </h2>
        </div>

        <div className="sidebar-title">Global Management</div>
        <button
          className={`sidebar-link ${activeTab === "schools" ? "active" : ""}`}
          onClick={() => setActiveTab("schools")}
        >
          <span>🏢</span> School Directory
        </button>
        <button
          className={`sidebar-link ${activeTab === "classes" ? "active" : ""}`}
          onClick={() => setActiveTab("classes")}
        >
          <span>📚</span> Master Classes
        </button>
        <button
          className={`sidebar-link ${activeTab === "mediums" ? "active" : ""}`}
          onClick={() => setActiveTab("mediums")}
        >
          <span>🌐</span> Master Mediums
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
        <h1 className="page-title">
          {activeTab === "schools" && "Registered Schools Directory"}
          {activeTab === "classes" && "Master Classes Repository"}
          {activeTab === "mediums" && "Master Mediums Repository"}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Fully connected to MySQL database. Changes are instantly synchronized.
        </p>

        <div className="dashboard-grid" style={{ alignItems: "start" }}>
          <div className="glass-panel">
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>
              Add New{" "}
              {activeTab === "schools"
                ? "School"
                : activeTab === "classes"
                  ? "Master Class"
                  : "Master Medium"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Excelsior High"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              {activeTab === "schools" && (
                <div className="input-group">
                  <label className="input-label">Address</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="123 Education Lane"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                  />
                </div>
              )}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%" }}
              >
                Save Entry
              </button>
            </form>
          </div>

          <div className="glass-panel">
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
              Active Entries
            </h2>
            <div
              style={{
                maxHeight: "600px",
                overflowY: "auto",
                paddingRight: "1rem",
              }}
            >
              {activeTab === "schools" &&
                schools.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: "var(--bg-tertiary)",
                      padding: "1.25rem",
                      borderRadius: "8px",
                      borderLeft: "4px solid var(--accent-primary)",
                      marginBottom: "1rem",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    {editSchoolId === s.id ? (
                      <form onSubmit={(e) => handleUpdateSchool(e, s.id)}>
                        <input
                          className="input-field"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ marginBottom: "0.5rem" }}
                          required
                        />
                        <input
                          className="input-field"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          style={{ marginBottom: "0.5rem" }}
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="submit"
                            className="btn-primary"
                            style={{
                              padding: "0.25rem 0.75rem",
                              fontSize: "0.9rem",
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditSchoolId(null)}
                            className="btn-primary"
                            style={{
                              padding: "0.25rem 0.75rem",
                              fontSize: "0.9rem",
                              background: "grey",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                fontSize: "1.1rem",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {s.name}
                            </h3>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {s.address || "No address provided"}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => {
                                setEditSchoolId(s.id);
                                setEditName(s.name);
                                setEditAddress(s.address);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#60a5fa",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSchool(s.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#f87171",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

              {(activeTab === "classes" || activeTab === "mediums") && (
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name Identifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === "classes"
                      ? masterClasses
                      : masterMediums
                    ).map((item) => (
                      <tr key={item.id}>
                        <td style={{ color: "var(--text-secondary)" }}>
                          #{item.id}
                        </td>
                        <td style={{ fontWeight: 500 }}>{item.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
