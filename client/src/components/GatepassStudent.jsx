import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function GatepassStudent() {
  const { user } = useAuth();
  const [gatepasses, setGatepasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const [form, setForm] = useState({
    accompany_type: "Father",
    out_date: "",
    out_time: "",
    purpose: "",
    document_url: "",
  });

  const fetchGatepasses = async () => {
    try {
      const res = await api.get("/gatepass");
      setGatepasses(res.data);
    } catch (err) {
      toast.error("Failed to fetch gatepasses", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchGatepasses();
      setLoading(false);
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/gatepass", {
        ...form,
        student_id: user.id,
      });
      toast.success("Gatepass request submitted!");
      setShowForm(false);
      fetchGatepasses();
      setForm({
        accompany_type: "Father",
        out_date: "",
        out_time: "",
        purpose: "",
        document_url: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed");
    }
  };

  return (
    <div className="animate-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>
            My Gatepasses
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Manage and track your leave requests
          </p>
        </div>
        <button
          className={showForm ? "btn-secondary" : "btn-primary"}
          onClick={() => setShowForm(!showForm)}
          style={{ minWidth: "180px" }}
        >
          {showForm ? "Cancel Request" : "Request Gatepass"}
        </button>
      </div>

      {showForm && (
        <div
          className="glass-panel animate-in"
          style={{
            marginBottom: "3rem",
            padding: "3.5rem",
            border: "1px solid #000",
          }}
        >
          <h2
            style={{
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>📝</span> New Request
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div className="input-group">
              <label className="input-label">Accompany Type</label>
              <select
                className="input-field"
                value={form.accompany_type}
                onChange={(e) =>
                  setForm({ ...form, accompany_type: e.target.value })
                }
                required
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sister">Sister</option>
                <option value="Brother">Brother</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Document (Optional)</label>
              <input
                className="input-field"
                placeholder="Paste proof/document URL"
                value={form.document_url}
                onChange={(e) =>
                  setForm({ ...form, document_url: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label className="input-label">Departure Date</label>
              <input
                type="date"
                className="input-field"
                value={form.out_date}
                onChange={(e) => setForm({ ...form, out_date: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Departure Time</label>
              <input
                type="time"
                className="input-field"
                value={form.out_time}
                onChange={(e) => setForm({ ...form, out_time: e.target.value })}
                required
              />
            </div>
            <div className="input-group" style={{ gridColumn: "span 2" }}>
              <label className="input-label">Purpose of Visit</label>
              <textarea
                className="input-field"
                style={{ minHeight: "100px", resize: "none" }}
                placeholder="Briefly describe the reason for your leave..."
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                required
              />
            </div>
            <button
              className="btn-primary"
              type="submit"
              style={{ gridColumn: "span 2", padding: "1.2rem" }}
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      <div className="dashboard-grid">
        {gatepasses.map((gp) => (
          <div
            key={gp.id}
            className="glass-panel"
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  PASS #{gp.id}
                </span>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    margin: "0.2rem 0",
                    color: "var(--text-primary)",
                  }}
                >
                  {new Date(gp.out_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#3b82f6",
                    fontWeight: 600,
                  }}
                >
                  {gp.out_time}
                </div>
              </div>
              <span
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: "0",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  background:
                    gp.request_status === "Approved"
                      ? "#f0fdf4"
                      : gp.request_status === "Rejected"
                        ? "#fef2f2"
                        : "#fffbeb",
                  color:
                    gp.request_status === "Approved"
                      ? "#15803d"
                      : gp.request_status === "Rejected"
                        ? "#b91c1c"
                        : "#b45309",
                  border: "1px solid currentColor",
                }}
              >
                {gp.request_status}
              </span>
            </div>

            <div
              style={{
                background: "var(--bg-tertiary)",
                padding: "1rem",
                borderRadius: "0",
                marginBottom: "1.5rem",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  fontSize: "0.9rem",
                  marginBottom: "0.8rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Escort</span>
                <span style={{ fontWeight: 600 }}>{gp.accompany_type}</span>
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {gp.purpose}
              </div>
            </div>

            <div style={{ marginTop: "auto" }}>
              {gp.request_status === "Approved" && (
                <button
                  className="btn-primary"
                  style={{
                    width: "100%",
                    background: "#3b82f6",
                    color: "white",
                  }}
                  onClick={() => setSelectedPass(gp)}
                >
                  <span>📱</span> Show QR Pass
                </button>
              )}
              {gp.remarks && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    borderLeft: "3px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: "0.4rem",
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Admin Remarks
                  </div>
                  {gp.remarks}
                </div>
              )}
            </div>
          </div>
        ))}

        {gatepasses.length === 0 && !loading && (
          <div
            style={{
              textAlign: "center",
              gridColumn: "1/-1",
              padding: "6rem 2rem",
              background: "rgba(255,255,255,0.4)",
              borderRadius: "24px",
              border: "2px dashed var(--border-color)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📭</div>
            <h3 style={{ marginBottom: "0.5rem" }}>No Gatepasses Found</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Your leave request history will appear here.
            </p>
          </div>
        )}
      </div>

      {selectedPass && (
        <div
          className="animate-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={() => setSelectedPass(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: "440px",
              width: "100%",
              textAlign: "center",
              padding: "3rem",
              background: "white",
              transform: "scale(1.05)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                Digital Gatepass
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Present this QR to the security officer
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "0",
                display: "inline-block",
                border: "2px solid #000",
              }}
            >
              <img
                src={selectedPass.qrCode}
                alt="QR Code"
                style={{ width: "200px", height: "200px" }}
              />
            </div>

            <div
              style={{
                margin: "2rem 0",
                padding: "1.5rem",
                background: "var(--bg-tertiary)",
                borderRadius: "0",
                textAlign: "left",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      fontWeight: 800,
                    }}
                  >
                    Student
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {selectedPass.first_name} {selectedPass.last_name}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      fontWeight: 800,
                    }}
                  >
                    ID
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                    #{selectedPass.id}
                  </div>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    fontWeight: 800,
                  }}
                >
                  Scheduled Departure
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  {new Date(selectedPass.out_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at {selectedPass.out_time}
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "1.2rem" }}
              onClick={() => setSelectedPass(null)}
            >
              Dismiss Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
