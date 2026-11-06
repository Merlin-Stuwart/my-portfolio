import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaUserCheck, FaTachometerAlt, FaLayerGroup, FaTools, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Stats() {
  const { statsData, setStatsData, isAdmin } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [tempStats, setTempStats] = useState(statsData);

  const icons = [FaUserCheck, FaTachometerAlt, FaLayerGroup, FaTools];
  const colors = ["#38bdf8", "#4ade80", "#a855f7", "#f59e0b"];

  const handleSave = (e) => {
    e.preventDefault();
    setStatsData(tempStats);
    setIsEditing(false);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...tempStats];
    updated[index][field] = value;
    setTempStats(updated);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-info">
          <h2 className="section-heading">Developer Impact Snapshot</h2>
          <p className="section-subtitle">
            Key metrics reflecting production software delivery, bot performance impact, and technical breadth.
          </p>
        </div>

        {/* ADMIN EDIT BUTTON */}
        {isAdmin && (
          <button
            className="admin-header-btn"
            onClick={() => {
              setTempStats(statsData);
              setIsEditing(true);
            }}
          >
            <FaEdit /> Edit Stats & Metrics
          </button>
        )}
      </div>

      <div className="stats-row">
        {statsData.map((s, index) => {
          const Icon = icons[index % icons.length] || FaUserCheck;
          const color = colors[index % colors.length] || "#38bdf8";

          return (
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              className="card"
              key={s.label + index}
              style={{
                border: `1px solid ${color}33`,
                background: `linear-gradient(135deg, rgba(15, 23, 42, 0.6), ${color}0d)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: "#f3f4f6",
                      lineHeight: "1.1",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: color,
                      fontWeight: "600",
                      marginTop: "0.15rem",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EDIT STATS MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              background: "rgba(2, 6, 23, 0.85)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            }}
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                background: "#0f172a",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                borderRadius: "20px",
                padding: "2rem",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  position: "absolute",
                  top: "1.2rem",
                  right: "1.2rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "#9ca3af",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes />
              </button>

              <h2 style={{ fontSize: "1.3rem", color: "#f3f4f6", fontWeight: "700", marginBottom: "1.2rem" }}>
                Edit Stats & Metrics
              </h2>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {tempStats.map((s, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.8rem",
                      background: "rgba(2, 6, 23, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      padding: "0.8rem",
                    }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Metric Value
                      </label>
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          background: "#0f172a",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "0.85rem",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Label
                      </label>
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          background: "#0f172a",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "0.85rem",
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.8rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaSave /> Save Metrics Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Stats;
