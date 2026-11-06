import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Experience() {
  const { experiencesData, setExperiencesData, isAdmin } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [tempExp, setTempExp] = useState(experiencesData);

  const handleSave = (e) => {
    e.preventDefault();
    setExperiencesData(tempExp);
    setIsEditing(false);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...tempExp];
    updated[index][field] = value;
    setTempExp(updated);
  };

  const handleAddExperience = () => {
    setTempExp([
      {
        year: "2024",
        company: "Company Name",
        title: "Job Title",
        description: "Key contributions and achievements...",
      },
      ...tempExp,
    ]);
  };

  const handleDeleteExperience = (index) => {
    const updated = tempExp.filter((_, i) => i !== index);
    setTempExp(updated);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-info">
          <h2 className="section-heading">Work Experience</h2>
          <p className="section-subtitle">
            Hands-on experience delivering AI/ML and full-stack software applications in production.
          </p>
        </div>

        {/* ADMIN EDIT BUTTON */}
        {isAdmin && (
          <button
            className="admin-header-btn"
            onClick={() => {
              setTempExp(experiencesData);
              setIsEditing(true);
            }}
          >
            <FaEdit /> Edit Experience
          </button>
        )}
      </div>

      <div className="card">
        <div className="timeline">
          {experiencesData.map((exp, idx) => (
            <div className="timeline-item" key={exp.year + exp.title + idx}>
              <div className="timeline-dot" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#f3f4f6" }}>
                    {exp.title}
                  </h4>
                  {exp.company && (
                    <div style={{ color: "#38bdf8", fontSize: "0.9rem", fontWeight: "500" }}>
                      {exp.company}
                    </div>
                  )}
                </div>
                <span
                  className="chip"
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderColor: "#38bdf8", color: "#38bdf8" }}
                >
                  {exp.year}
                </span>
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.92rem",
                  marginTop: "0.5rem",
                  lineHeight: "1.5",
                }}
              >
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT EXPERIENCE MODAL */}
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
                maxWidth: "600px",
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
                Edit Work Experience
              </h2>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {tempExp.map((exp, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(2, 6, 23, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      padding: "1rem",
                      position: "relative",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(index)}
                      style={{
                        position: "absolute",
                        top: "0.8rem",
                        right: "0.8rem",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171",
                        padding: "0.3rem 0.5rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash /> Delete
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.6rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => handleFieldChange(index, "title", e.target.value)}
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
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleFieldChange(index, "company", e.target.value)}
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

                    <div style={{ marginBottom: "0.6rem" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Period / Year
                      </label>
                      <input
                        type="text"
                        value={exp.year}
                        onChange={(e) => handleFieldChange(index, "year", e.target.value)}
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
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          background: "#0f172a",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "0.85rem",
                          lineHeight: "1.4",
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddExperience}
                  style={{
                    padding: "0.6rem",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px dashed rgba(255, 255, 255, 0.2)",
                    color: "#e2e8f0",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FaPlus /> Add New Experience
                </button>

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
                  <FaSave /> Save Experience Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Experience;
