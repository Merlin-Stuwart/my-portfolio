import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaCheckCircle,
  FaCogs,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
} from "react-icons/fa";

const categories = ["All", "Automation", "AI & LLMs", "Full-Stack"];

function Projects() {
  const { isAdmin, projectsData, addProject, updateProject, deleteProject } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  // Form states for Add / Edit Project Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Automation",
    badge: "New Release",
    live: false,
    liveUrl: "",
    githubUrl: "",
    image: "",
    tech: "",
    description: "",
    highlights: "",
    architecture: "",
  });

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  const handleOpenAdd = () => {
    setEditingProjectId(null);
    setFormData({
      title: "",
      category: "Automation",
      badge: "New Release",
      live: false,
      liveUrl: "",
      githubUrl: "",
      image: "",
      tech: "",
      description: "",
      highlights: "",
      architecture: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project, e) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setFormData({
      title: project.title || "",
      category: project.category || "Automation",
      badge: project.badge || "",
      live: project.live || false,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      image: project.image || "",
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech || "",
      description: project.description || "",
      highlights: Array.isArray(project.highlights) ? project.highlights.join("\n") : project.highlights || "",
      architecture: project.architecture || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProject(id);
      if (selectedProject?.id === id) setSelectedProject(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedTech = formData.tech
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const formattedHighlights = formData.highlights
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const projectObject = {
      title: formData.title,
      category: formData.category,
      badge: formData.badge,
      live: formData.live,
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl,
      image: formData.image,
      tech: formattedTech,
      description: formData.description,
      highlights: formattedHighlights,
      architecture: formData.architecture,
    };

    if (editingProjectId) {
      updateProject(editingProjectId, projectObject);
    } else {
      addProject(projectObject);
    }

    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-header-info">
          <h2 className="section-heading">Featured Projects</h2>
          <p className="section-subtitle">
            Production-ready automation bots, AI models, and full-stack web applications.
          </p>
        </div>

        {/* ADMIN ADD PROJECT BUTTON */}
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="admin-header-btn btn-accent"
          >
            <FaPlus /> Add New Project
          </button>
        )}
      </div>

      {/* CATEGORY FILTER TABS */}
      <div
        style={{
          display: "flex",
          gap: "0.8rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "999px",
              border: activeCategory === cat ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.12)",
              background: activeCategory === cat ? "rgba(56, 189, 248, 0.18)" : "rgba(255, 255, 255, 0.04)",
              color: activeCategory === cat ? "#38bdf8" : "#9ca3af",
              fontSize: "0.88rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PROJECTS GRID */}
      <motion.div layout className="grid-3">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="card"
              key={project.id || project.title}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                position: "relative",
              }}
              onClick={() => setSelectedProject(project)}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.8rem",
                  }}
                >
                  <span
                    className="chip"
                    style={{
                      borderColor: "rgba(56, 189, 248, 0.4)",
                      color: "#38bdf8",
                      fontSize: "0.75rem",
                    }}
                  >
                    {project.badge || project.category}
                  </span>
                  <span
                    className="chip"
                    style={{
                      borderColor: project.live ? "var(--accent)" : "var(--border)",
                      color: project.live ? "#4ade80" : "#9ca3af",
                      fontSize: "0.7rem",
                    }}
                  >
                    {project.live ? "● LIVE" : "In Progress"}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#f3f4f6",
                    marginBottom: "0.6rem",
                    lineHeight: "1.4",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {project.description}
                </p>

                <div style={{ marginBottom: "1.2rem" }}>
                  {project.tech && project.tech.map((t) => (
                    <span className="chip" key={t} style={{ fontSize: "0.72rem" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.8rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#38bdf8",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    View Details & Architecture →
                  </span>
                </div>

                {/* ADMIN EDIT / DELETE BUTTONS */}
                {isAdmin && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.8rem",
                      paddingTop: "0.6rem",
                      borderTop: "1px dashed rgba(56, 189, 248, 0.3)",
                    }}
                  >
                    <button
                      onClick={(e) => handleOpenEdit(project, e)}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0.6rem",
                        borderRadius: "8px",
                        background: "rgba(56, 189, 248, 0.15)",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        color: "#38bdf8",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={(e) => handleDelete(project.id, project.title, e)}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(2, 6, 23, 0.85)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                background: "#0f172a",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "24px",
                padding: "2.2rem",
                maxWidth: "650px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  position: "absolute",
                  top: "1.2rem",
                  right: "1.2rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "#9ca3af",
                  width: "36px",
                  height: "36px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}
              >
                <FaTimes />
              </button>

              {/* Project Visual Preview Banner */}
              {selectedProject.image && (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    marginBottom: "1.2rem",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    background: "rgba(2, 6, 23, 0.8)",
                  }}
                >
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <span className="chip" style={{ borderColor: "#38bdf8", color: "#38bdf8" }}>
                  {selectedProject.category}
                </span>
                {selectedProject.live && (
                  <span className="chip" style={{ borderColor: "#4ade80", color: "#4ade80" }}>
                    ● Production Live
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f3f4f6", marginBottom: "0.8rem" }}>
                {selectedProject.title}
              </h2>

              <p style={{ fontSize: "0.95rem", color: "#d1d5db", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                {selectedProject.description}
              </p>

              {/* Highlights */}
              {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "1rem", color: "#38bdf8", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FaCheckCircle /> Key Technical Achievements
                  </h4>
                  <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem", color: "#e5e7eb" }}>
                    {selectedProject.highlights.map((h, i) => (
                      <li key={i} style={{ marginBottom: "0.4rem", lineHeight: "1.5" }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* System Architecture */}
              {selectedProject.architecture && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "0.95rem", color: "#a855f7", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FaCogs /> High-Level Architecture
                  </h4>
                  <div
                    style={{
                      background: "rgba(2, 6, 23, 0.8)",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "12px",
                      padding: "0.9rem 1.1rem",
                      fontSize: "0.85rem",
                      fontFamily: "monospace",
                      color: "#e2e8f0",
                    }}
                  >
                    {selectedProject.architecture}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {selectedProject.tech && selectedProject.tech.length > 0 && (
                <div style={{ marginBottom: "1.8rem" }}>
                  <h4 style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
                    Technologies & Frameworks
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {selectedProject.tech.map((t) => (
                      <span className="chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem" }}>
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <FaGithub /> View Source on GitHub
                  </a>
                )}
                {selectedProject.live && selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <FaExternalLinkAlt /> Open Project
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN ADD / EDIT FORM MODAL */}
      <AnimatePresence>
        {isFormOpen && (
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
            onClick={() => setIsFormOpen(false)}
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
                onClick={() => setIsFormOpen(false)}
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

              <h2 style={{ fontSize: "1.4rem", color: "#f3f4f6", fontWeight: "700", marginBottom: "1.5rem" }}>
                {editingProjectId ? "Edit Project Details" : "Add New Project"}
              </h2>

              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. AI-Powered Chatbot"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.8rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.8rem",
                        background: "#0f172a",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#fff",
                        outline: "none",
                      }}
                    >
                      <option value="Automation">Automation</option>
                      <option value="AI & LLMs">AI & LLMs</option>
                      <option value="Full-Stack">Full-Stack</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Production Rollout"
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.8rem",
                        background: "rgba(2, 6, 23, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief explanation of the project..."
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.8rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Technologies (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    placeholder="Python, React.js, Docker, REST API"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.8rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Key Highlights (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="Cut response time by 40%&#10;Integrated vector database"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.8rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Architecture Description / Diagram Flow
                  </label>
                  <input
                    type="text"
                    value={formData.architecture}
                    onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                    placeholder="React Frontend ↔ FastAPI ↔ LLM Engine"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.8rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Project Screenshot / Preview Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /project-preview.png"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.8rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.8rem",
                        background: "rgba(2, 6, 23, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      Live Demo URL
                    </label>
                    <input
                      type="text"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://my-app.com"
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.8rem",
                        background: "rgba(2, 6, 23, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.4rem" }}>
                  <input
                    type="checkbox"
                    id="liveCheck"
                    checked={formData.live}
                    onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                  />
                  <label htmlFor="liveCheck" style={{ fontSize: "0.9rem", color: "#e2e8f0", cursor: "pointer" }}>
                    Mark Project as Production Live
                  </label>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: "1rem",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(56, 189, 248, 0.4)",
                  }}
                >
                  <FaSave /> Save Project Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Projects;
