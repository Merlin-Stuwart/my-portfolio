import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaQuoteLeft, FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaUserTie } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Testimonials() {
  const { testimonialsData, setTestimonialsData, isAdmin } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTestimonials, setTempTestimonials] = useState(testimonialsData || []);

  const openModal = () => {
    setTempTestimonials(testimonialsData ? JSON.parse(JSON.stringify(testimonialsData)) : []);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setTestimonialsData(tempTestimonials);
    setIsEditing(false);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...tempTestimonials];
    updated[index][field] = value;
    setTempTestimonials(updated);
  };

  const addTestimonial = () => {
    setTempTestimonials([
      ...tempTestimonials,
      {
        name: "Name / Title",
        role: "Role / Position",
        company: "Company Name",
        quote: "Feedback or recommendation statement...",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=" + Date.now()
      }
    ]);
  };

  const deleteTestimonial = (index) => {
    setTempTestimonials(tempTestimonials.filter((_, i) => i !== index));
  };

  if (!testimonialsData || testimonialsData.length === 0) return null;

  return (
    <div>
      <div className="section-header">
        <div className="section-header-info">
          <h2 className="section-heading">Recommendations & Endorsements</h2>
          <p className="section-subtitle">
            What engineering leads, project managers, and collaborators say about working with me.
          </p>
        </div>

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
            <FaEdit /> Edit Recommendations
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {testimonialsData.map((item, idx) => (
          <motion.div
            key={idx}
            className="card"
            whileHover={{ y: -5 }}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
            }}
          >
            <div>
              <FaQuoteLeft style={{ fontSize: "1.5rem", color: "rgba(56, 189, 248, 0.4)", marginBottom: "1rem" }} />
              <p
                style={{
                  color: "#e2e8f0",
                  fontSize: "0.93rem",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                  marginBottom: "1.5rem"
                }}
              >
                "{item.quote}"
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0284c7, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "1.1rem",
                  flexShrink: 0
                }}
              >
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                ) : (
                  <FaUserTie />
                )}
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f3f4f6" }}>{item.name}</h4>
                <div style={{ fontSize: "0.82rem", color: "#38bdf8", fontWeight: "500" }}>{item.role}</div>
                {item.company && <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>{item.company}</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EDIT MODAL */}
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
                Edit Recommendations
              </h2>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {tempTestimonials.map((item, index) => (
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
                      onClick={() => deleteTestimonial(index)}
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
                          Person Name / Designation
                        </label>
                        <input
                          type="text"
                          value={item.name || ""}
                          onChange={(e) => handleFieldChange(index, "name", e.target.value)}
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
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={item.role || ""}
                          onChange={(e) => handleFieldChange(index, "role", e.target.value)}
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
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={item.company || ""}
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

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Recommendation Statement / Quote
                      </label>
                      <textarea
                        rows={3}
                        value={item.quote || ""}
                        onChange={(e) => handleFieldChange(index, "quote", e.target.value)}
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
                  onClick={addTestimonial}
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
                  <FaPlus /> Add New Recommendation
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
                  <FaSave /> Save Recommendations
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Testimonials;
