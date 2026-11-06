import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaCode, FaLaptopCode, FaBrain, FaDatabase, FaTools, FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getCategoryIcon = (category) => {
  if (category.includes("Programming")) return <FaCode style={{ color: "#38bdf8" }} />;
  if (category.includes("Web")) return <FaLaptopCode style={{ color: "#4ade80" }} />;
  if (category.includes("AI")) return <FaBrain style={{ color: "#a855f7" }} />;
  if (category.includes("Databases")) return <FaDatabase style={{ color: "#f59e0b" }} />;
  return <FaTools style={{ color: "#ec4899" }} />;
};

function Skills() {
  const { skillsData, setSkillsData, isAdmin } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [tempSkills, setTempSkills] = useState(skillsData);

  const handleSave = (e) => {
    e.preventDefault();
    setSkillsData(tempSkills);
    setIsEditing(false);
  };

  const handleCategoryChange = (index, newCategory) => {
    const updated = [...tempSkills];
    updated[index].category = newCategory;
    setTempSkills(updated);
  };

  const handleItemsChange = (index, itemsString) => {
    const updated = [...tempSkills];
    updated[index].items = itemsString
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setTempSkills(updated);
  };

  const handleAddCategory = () => {
    setTempSkills([
      ...tempSkills,
      { category: "New Skill Group", items: ["Skill 1", "Skill 2"] },
    ]);
  };

  const handleDeleteCategory = (index) => {
    const updated = tempSkills.filter((_, i) => i !== index);
    setTempSkills(updated);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-info">
          <h2 className="section-heading">Skills & Tech Stack</h2>
          <p className="section-subtitle">
            Core languages, frameworks, AI/ML concepts, databases, and DevOps tools I use to build scalable products.
          </p>
        </div>

        {/* ADMIN EDIT BUTTON */}
        {isAdmin && (
          <button
            className="admin-header-btn"
            onClick={() => {
              setTempSkills(skillsData);
              setIsEditing(true);
            }}
          >
            <FaEdit /> Edit Skills
          </button>
        )}
      </div>

      <div className="grid-3">
        {skillsData.map((group) => (
          <div
            className="card"
            key={group.category}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              transition: "transform 0.3s ease, border-color 0.3s ease",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "0.8rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  {getCategoryIcon(group.category)}
                </div>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#f3f4f6",
                  }}
                >
                  {group.category}
                </h3>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1rem" }}>
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="chip"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      borderColor: "rgba(255, 255, 255, 0.14)",
                      color: "#e2e8f0",
                      fontSize: "0.82rem",
                      padding: "0.35rem 0.75rem",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT SKILLS MODAL */}
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
                Edit Skills & Categories
              </h2>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {tempSkills.map((group, index) => (
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
                      onClick={() => handleDeleteCategory(index)}
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
                      <FaTrash /> Delete Group
                    </button>

                    <div style={{ marginBottom: "0.6rem" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                        style={{
                          width: "80%",
                          padding: "0.5rem",
                          background: "#0f172a",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.2rem" }}>
                        Skills (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={group.items.join(", ")}
                        onChange={(e) => handleItemsChange(index, e.target.value)}
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
                  type="button"
                  onClick={handleAddCategory}
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
                  <FaPlus /> Add New Skill Group
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
                  <FaSave /> Save Skills Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Skills;
