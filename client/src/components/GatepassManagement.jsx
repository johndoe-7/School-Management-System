import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";

export default function GatepassManagement() {
  const [gatepasses, setGatepasses] = useState([]);
  const [search, setSearch] = useState("");
  const [actioning, setActioning] = useState(null);
  const [remarks, setRemarks] = useState("");

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
    };
    init();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/gatepass/${id}/status`, {
        request_status: status,
        remarks: remarks,
      });
      toast.success(`Gatepass ${status.toLowerCase()}ed`);
      setActioning(null);
      setRemarks("");
      fetchGatepasses();
    } catch (err) {
      toast.error("Update failed", err);
    }
  };

  const filtered = gatepasses.filter(
    (gp) =>
      gp.enrollment_number.toLowerCase().includes(search.toLowerCase()) ||
      `${gp.first_name} ${gp.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div className="animate-in">
      <div className="glass-panel" style={{ marginBottom: "2.5rem", padding: "1.5rem 2rem" }}>
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
          <div style={{ fontSize: "1.2rem", opacity: 0.5 }}>🔍</div>
          <input
            className="input-field"
            placeholder="Search by student name or enrollment number..."
            style={{ flex: 1, border: "none", background: "transparent", padding: 0, fontSize: "1.1rem", boxShadow: "none" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="glass-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: "1.5rem" }}>Student Info</th>
              <th>Request Details</th>
              <th>Status</th>
              <th style={{ paddingRight: "1.5rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((gp) => (
              <tr key={gp.id}>
                <td style={{ paddingLeft: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "var(--bg-tertiary)", 
                      borderRadius: "12px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#3b82f6"
                    }}>
                      {gp.first_name[0]}{gp.last_name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{gp.first_name} {gp.last_name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{gp.enrollment_number}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                    {new Date(gp.out_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at <span style={{ color: "#3b82f6" }}>{gp.out_time}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    Escort: {gp.accompany_type} • <span style={{ fontStyle: "italic" }}>"{gp.purpose}"</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <span style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      width: "fit-content",
                      background: gp.request_status === "Approved" ? "rgba(34, 197, 94, 0.1)" : gp.request_status === "Rejected" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: gp.request_status === "Approved" ? "#16a34a" : gp.request_status === "Rejected" ? "#dc2626" : "#d97706",
                      border: "1px solid currentColor"
                    }}>
                      {gp.request_status}
                    </span>
                    {gp.approver_first_name && (
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        By {gp.approver_first_name}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ paddingRight: "1.5rem", textAlign: "right" }}>
                  {gp.request_status === "Pending" && actioning !== gp.id && (
                    <button
                      className="btn-primary"
                      style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem", borderRadius: "10px" }}
                      onClick={() => setActioning(gp.id)}
                    >
                      Process Request
                    </button>
                  )}

                  {actioning === gp.id && (
                    <div className="animate-in" style={{ 
                      minWidth: "280px", 
                      background: "white", 
                      padding: "1.5rem", 
                      borderRadius: "16px", 
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      border: "1px solid var(--border-color)",
                      textAlign: "left",
                      position: "absolute",
                      right: "1.5rem",
                      zIndex: 100
                    }}>
                      <div style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>Process Leave Request</div>
                      <textarea
                        className="input-field"
                        placeholder="Add internal remarks or reason for rejection..."
                        style={{ fontSize: "0.9rem", minHeight: "80px", marginBottom: "1rem", width: "100%", resize: "none" }}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                          className="btn-primary"
                          style={{ flex: 1, padding: "0.8rem", background: "#000" }}
                          onClick={() => handleUpdateStatus(gp.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, padding: "0.8rem", color: "#dc2626", borderColor: "#dc2626" }}
                          onClick={() => handleUpdateStatus(gp.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                      <button
                        style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "1rem", cursor: "pointer", fontWeight: 700, width: "100%", textAlign: "center", textTransform: "uppercase" }}
                        onClick={() => setActioning(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
                  <div>No matching requests found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
