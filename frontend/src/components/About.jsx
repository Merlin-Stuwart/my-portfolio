import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaGraduationCap, FaCertificate, FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function About() {
  const {
    profileData,
    setProfileData,
    summaryData,
    setSummaryData,
    educationData,
    setEducationData,
    certificationsData,
    setCertificationsData,
    isAdmin
  } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  // Local Edit State
  const [tempProfile, setTempProfile] = useState(profileData);
  const [tempSummary, setTempSummary] = useState(summaryData);
  const [tempEducation, setTempEducation] = useState(educationData || []);
  const [tempCertifications, setTempCertifications] = useState(certificationsData || []);

  const openModal = () => {
    setTempProfile({ ...profileData });
    setTempSummary(summaryData);
    setTempEducation(educationData ? JSON.parse(JSON.stringify(educationData)) : []);
    setTempCertifications(certificationsData ? [...certificationsData] : []);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfileData(tempProfile);
    setSummaryData(tempSummary);
    setEducationData(tempEducation);
    setCertificationsData(tempCertifications);
    setIsEditing(false);
  };

  // Education Helpers
  const addEducationItem = () => {
    setTempEducation([...tempEducation, { degree: "", institution: "", year: "" }]);
  };

  const updateEducationItem = (index, field, value) => {
    const updated = [...tempEducation];
    updated[index] = { ...updated[index], [field]: value };
    setTempEducation(updated);
  };

  const removeEducationItem = (index) => {
    setTempEducation(tempEducation.filter((_, i) => i !== index));
  };

  // Certifications Helpers
  const addCertItem = () => {
    setTempCertifications([...tempCertifications, ""]);
  };

  const updateCertItem = (index, value) => {
    const updated = [...tempCertifications];
    updated[index] = value;
    setTempCertifications(updated);
  };

  const removeCertItem = (index) => {
    setTempCertifications(tempCertifications.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-info">
          <h2 className="section-heading">About Me</h2>
          <p className="section-subtitle">
            Building next-generation full-stack web applications & AI-driven intelligent solutions.
          </p>
        </div>

        {/* ADMIN EDIT BUTTON */}
        {isAdmin && (
          <button
            className="admin-header-btn"
            onClick={openModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #0284c7, #6366f1)",
              color: "#fff",
              padding: "0.55rem 1.1rem",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.88rem"
            }}
          >
            <FaEdit /> Edit About Section
          </button>
        )}
      </div>

      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.8rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.2rem", color: "#38bdf8", marginBottom: "0.8rem" }}>
            Professional Profile
          </h3>
          <p style={{ fontSize: "0.98rem", color: "#e5e7eb", lineHeight: "1.6" }}>
            I am <strong>{profileData?.name}</strong>, an <strong>{profileData?.role}</strong> based in{" "}
            <strong>{profileData?.location}</strong>.
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#d1d5db",
              marginTop: "0.8rem",
              lineHeight: "1.6",
              whiteSpace: "pre-line"
            }}
          >
            {summaryData}
          </p>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          {/* Education */}
          <div className="card" style={{ padding: "1rem", boxShadow: "none", background: "rgba(255, 255, 255, 0.03)" }}>
            <div style={{ fontSize: "0.9rem", color: "#38bdf8", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaGraduationCap /> Education
            </div>
            {educationData && educationData.length > 0 ? (
              educationData.map((edu, idx) => (
                <div key={idx} style={{ marginTop: "0.6rem", fontSize: "0.88rem" }}>
                  <div style={{ fontWeight: "600", color: "#f3f4f6" }}>{edu.degree}</div>
                  <div style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
                    {edu.institution} {edu.year ? `• (${edu.year})` : ""}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ marginTop: "0.6rem", fontSize: "0.85rem", color: "#9ca3af" }}>No education items listed.</div>
            )}
          </div>

          {/* Certifications */}
          <div className="card" style={{ padding: "1rem", boxShadow: "none", background: "rgba(255, 255, 255, 0.03)" }}>
            <div style={{ fontSize: "0.9rem", color: "#10b981", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaCertificate /> Certifications & Training
            </div>
            {certificationsData && certificationsData.length > 0 ? (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#d1d5db" }}>
                {certificationsData.map((cert, idx) => (
                  <li key={idx} style={{ marginBottom: "0.3rem" }}>{cert}</li>
                ))}
              </ul>
            ) : (
              <div style={{ marginTop: "0.6rem", fontSize: "0.85rem", color: "#9ca3af" }}>No certifications listed.</div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT ALL ABOUT SECTION MODAL */}
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
                padding: "1.8rem",
                maxWidth: "650px",
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

              <h2 style={{ fontSize: "1.3rem", color: "#f3f4f6", fontWeight: "700", marginBottom: "1rem" }}>
                Edit About Section
              </h2>

              {/* TABS FOR SECTIONS */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "0.6rem" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "8px",
                    border: "none",
                    background: activeTab === "summary" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                    color: activeTab === "summary" ? "#38bdf8" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Profile & Summary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("education")}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "8px",
                    border: "none",
                    background: activeTab === "education" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                    color: activeTab === "education" ? "#38bdf8" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Education ({tempEducation.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("certifications")}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "8px",
                    border: "none",
                    background: activeTab === "certifications" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                    color: activeTab === "certifications" ? "#38bdf8" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Certifications ({tempCertifications.length})
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* TAB 1: PROFILE & SUMMARY */}
                {activeTab === "summary" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={tempProfile.name || ""}
                          onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "0.6rem",
                            background: "rgba(2, 6, 23, 0.6)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "0.88rem"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={tempProfile.location || ""}
                          onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "0.6rem",
                            background: "rgba(2, 6, 23, 0.6)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "0.88rem"
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Professional Title / Role
                      </label>
                      <input
                        type="text"
                        value={tempProfile.role || ""}
                        onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          background: "rgba(2, 6, 23, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "0.88rem"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Professional Summary Paragraph
                      </label>
                      <textarea
                        rows={5}
                        value={tempSummary}
                        onChange={(e) => setTempSummary(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(2, 6, 23, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "0.88rem",
                          lineHeight: "1.5",
                        }}
                      />
                    </div>
                  </>
                )}

                {/* TAB 2: EDUCATION */}
                {activeTab === "education" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {tempEducation.map((edu, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "rgba(255, 255, 255, 0.04)",
                          padding: "0.8rem",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          position: "relative"
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => removeEducationItem(idx)}
                          style={{
                            position: "absolute",
                            top: "0.6rem",
                            right: "0.6rem",
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "none",
                            color: "#f87171",
                            borderRadius: "6px",
                            padding: "0.3rem 0.5rem",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          <FaTrash /> Remove
                        </button>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#9ca3af" }}>Degree / Course</label>
                          <input
                            type="text"
                            value={edu.degree || ""}
                            onChange={(e) => updateEducationItem(idx, "degree", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.45rem",
                              background: "rgba(2, 6, 23, 0.6)",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              borderRadius: "6px",
                              color: "#fff",
                              fontSize: "0.85rem"
                            }}
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#9ca3af" }}>Institution</label>
                            <input
                              type="text"
                              value={edu.institution || ""}
                              onChange={(e) => updateEducationItem(idx, "institution", e.target.value)}
                              style={{
                                width: "100%",
                                padding: "0.45rem",
                                background: "rgba(2, 6, 23, 0.6)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "6px",
                                color: "#fff",
                                fontSize: "0.85rem"
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "#9ca3af" }}>Year / Duration</label>
                            <input
                              type="text"
                              value={edu.year || ""}
                              onChange={(e) => updateEducationItem(idx, "year", e.target.value)}
                              style={{
                                width: "100%",
                                padding: "0.45rem",
                                background: "rgba(2, 6, 23, 0.6)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "6px",
                                color: "#fff",
                                fontSize: "0.85rem"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addEducationItem}
                      style={{
                        padding: "0.6rem",
                        borderRadius: "8px",
                        background: "rgba(56, 189, 248, 0.15)",
                        border: "1px dashed rgba(56, 189, 248, 0.4)",
                        color: "#38bdf8",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem"
                      }}
                    >
                      <FaPlus /> Add Education Entry
                    </button>
                  </div>
                )}

                {/* TAB 3: CERTIFICATIONS */}
                {activeTab === "certifications" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {tempCertifications.map((cert, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => updateCertItem(idx, e.target.value)}
                          placeholder="Certification name / institution"
                          style={{
                            flex: 1,
                            padding: "0.55rem",
                            background: "rgba(2, 6, 23, 0.6)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            borderRadius: "6px",
                            color: "#fff",
                            fontSize: "0.85rem"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeCertItem(idx)}
                          style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "none",
                            color: "#f87171",
                            borderRadius: "6px",
                            padding: "0.6rem",
                            cursor: "pointer"
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addCertItem}
                      style={{
                        marginTop: "0.4rem",
                        padding: "0.6rem",
                        borderRadius: "8px",
                        background: "rgba(16, 185, 129, 0.15)",
                        border: "1px dashed rgba(16, 185, 129, 0.4)",
                        color: "#34d399",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem"
                      }}
                    >
                      <FaPlus /> Add Certification Entry
                    </button>
                  </div>
                )}

                {/* SAVE BUTTON */}
                <button
                  type="submit"
                  style={{
                    marginTop: "0.8rem",
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
                  <FaSave /> Save All About Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default About;
