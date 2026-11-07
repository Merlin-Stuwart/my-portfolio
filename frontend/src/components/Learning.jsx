import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Learning() {
  const { learningData, setLearningData, isAdmin } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [tempLearning, setTempLearning] = useState([]);

  const openModal = () => {
    setTempLearning(Array.isArray(learningData) ? [...learningData] : []);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const cleaned = tempLearning.map((item) => item.trim()).filter(Boolean);
    setLearningData(cleaned);
    setIsEditing(false);
  };

  const handleItemChange = (index, value) => {
    const updated = [...tempLearning];
    updated[index] = value;
    setTempLearning(updated);
  };

  const handleAddItem = () => {
    setTempLearning([...tempLearning, ""]);
  };

  const handleDeleteItem = (index) => {
    setTempLearning(tempLearning.filter((_, i) => i !== index));
  };

  const displayList = Array.isArray(learningData) ? learningData : [];

  return (
    <div>
      <div className="section-header">
        <div className="section-header-info">
          <h2 className="section-heading">What I’m Learning</h2>
          <p className="section-subtitle">
            Concepts I’ve explored and keep sharpening.
          </p>
        </div>

        {/* ADMIN EDIT BUTTON */}
        {isAdmin && (
          <button
            className="admin-header-btn"
            onClick={openModal}
            title="Edit What I'm Learning concepts"
          >
            <FaEdit /> Edit Learning
          </button>
        )}
      </div>

      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "0.6rem 1.5rem",
          }}
        >
          {displayList.map((item, idx) => (
            <div
              key={idx}
              style={{
                fontSize: "0.94rem",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.45rem",
              }}
            >
              <span style={{ color: "#4ade80", marginTop: "2px" }}>✅</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
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
                maxWidth: "540px",
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
                Edit What I’m Learning
              </h2>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {tempLearning.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "rgba(2, 6, 23, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "0.4rem 0.6rem",
                      }}
                    >
                      <span style={{ color: "#4ade80", fontSize: "0.9rem" }}>✅</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        placeholder="e.g. LLM Fine-Tuning & Prompt Engineering"
                        style={{
                          flex: 1,
                          padding: "0.45rem",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#f87171",
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                        title="Delete concept"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  style={{
                    padding: "0.65rem",
                    borderRadius: "8px",
                    background: "rgba(56, 189, 248, 0.1)",
                    border: "1px dashed rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginTop: "0.4rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <FaPlus size={12} /> Add New Concept
                </button>

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
                  <FaSave /> Save Learning Concepts
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Learning;
