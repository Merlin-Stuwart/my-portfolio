import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt, FaDownload, FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ReactTyped } from "react-typed";

function Hero() {
  const { profileData, setProfileData, isAdmin } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profileData);
  const [activePhoto, setActivePhoto] = useState(1);
  const [photoEffect, setPhotoEffect] = useState("random"); // "random" | "glitch" | "flip" | "slide" | "zoom"
  const [currentActiveEffect, setCurrentActiveEffect] = useState("glitch");
  const [uploadStatus, setUploadStatus] = useState("");

  const handlePhotoSwitch = (targetPhoto) => {
    const nextPhoto = targetPhoto !== undefined ? targetPhoto : (activePhoto === 1 ? 2 : 1);
    if (photoEffect === "random") {
      const availableEffects = ["glitch", "flip", "slide", "zoom"];
      const filtered = availableEffects.filter((e) => e !== currentActiveEffect);
      const randomChoice = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentActiveEffect(randomChoice);
    } else {
      setCurrentActiveEffect(photoEffect);
    }
    setActivePhoto(nextPhoto);
  };

  const getVariants = () => {
    const activeVariantsEffect = photoEffect === "random" ? currentActiveEffect : photoEffect;
    switch (activeVariantsEffect) {
      case "flip":
        return {
          initial: { rotateY: 90, scale: 0.8, opacity: 0 },
          animate: { rotateY: 0, scale: 1, opacity: 1 },
          exit: { rotateY: -90, scale: 0.8, opacity: 0 },
          transition: { duration: 0.45, ease: "easeInOut" },
        };
      case "glitch":
        return {
          initial: { x: -20, opacity: 0, filter: "brightness(2) contrast(180%) hue-rotate(90deg)" },
          animate: { x: [12, -12, 6, -3, 0], opacity: 1, filter: "brightness(1) contrast(100%) hue-rotate(0deg)" },
          exit: { x: 20, opacity: 0, filter: "brightness(2) contrast(180%) hue-rotate(-90deg)" },
          transition: { duration: 0.4 },
        };
      case "slide":
        return {
          initial: { x: 100, rotate: 12, opacity: 0, scale: 0.9 },
          animate: { x: 0, rotate: 0, opacity: 1, scale: 1 },
          exit: { x: -100, rotate: -12, opacity: 0, scale: 0.9 },
          transition: { type: "spring", stiffness: 220, damping: 20 },
        };
      case "zoom":
      default:
        return {
          initial: { scale: 1.4, opacity: 0, filter: "blur(10px) brightness(1.5)" },
          animate: { scale: 1, opacity: 1, filter: "blur(0px) brightness(1)" },
          exit: { scale: 0.6, opacity: 0, filter: "blur(10px) brightness(1.5)" },
          transition: { duration: 0.45 },
        };
    }
  };

  const currentVariants = getVariants();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileData(tempProfile);
    setIsEditing(false);
  };

  const handleFileUploadToServer = async (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("targetField", targetField);
    formData.append("image", file);

    setUploadStatus(`Uploading ${targetField}...`);

    try {
      const response = await fetch(`http://localhost:5000/api/upload-avatar?targetField=${targetField}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setUploadStatus(`✅ ${targetField} permanently replaced in public folder!`);
        const updatedUrl = data.fileUrl;
        
        // Update both temp state and context state immediately
        setTempProfile((prev) => ({
          ...prev,
          [targetField]: updatedUrl,
        }));
        setProfileData((prev) => ({
          ...prev,
          [targetField]: updatedUrl,
        }));
      } else {
        setUploadStatus("❌ Upload failed!");
      }
    } catch (err) {
      console.error("Backend error, falling back to data URL:", err);
      // Fallback base64 preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setTempProfile((prev) => ({
          ...prev,
          [targetField]: dataUrl,
        }));
        setProfileData((prev) => ({
          ...prev,
          [targetField]: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
      setUploadStatus("⚠️ Updated locally (Backend offline)");
    }
  };

  // Determine photo URL with cache busting timestamp if it's a public static path
  const getPhotoUrl = (photoField, defaultFallback) => {
    const customUrl = profileData[photoField];
    if (!customUrl) return defaultFallback;
    return customUrl;
  };

  const currentPhotoUrl = activePhoto === 1 
    ? getPhotoUrl("avatar1", "/profile1.png") 
    : getPhotoUrl("avatar2", "/profile2.png");

  return (
    <div className="hero">
      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* ADMIN EDIT BUTTON FOR HERO SECTION */}
        {isAdmin && (
          <div style={{ marginBottom: "1rem" }}>
            <button
              className="admin-header-btn"
              onClick={() => {
                setTempProfile(profileData);
                setIsEditing(true);
                setUploadStatus("");
              }}
            >
              <FaEdit /> Edit Hero & Photos
            </button>
          </div>
        )}

        <div className="hero-badge-row">
          <div className="hero-badge">
            <span>🤖</span> AI/ML Developer
          </div>
          <div className="hero-badge">
            <span>⚡</span> Python & React.js
          </div>
          <div className="hero-badge">
            <span>🧠</span> RAG & LLMs
          </div>
        </div>

        <h1 className="hero-title">
          Hi, I’m <span>{profileData.name}</span>
        </h1>

        <ReactTyped
          strings={[
            "AI/ML & Full-Stack Software Developer 💻",
            "Python & React.js Engineer ⚡",
            "RAG Pipelines & LLM Specialist 🤖",
            "Production Automation Bot Creator 🚀",
          ]}
          typeSpeed={50}
          backSpeed={25}
          loop
          className="hero-subtitle"
        />

        <p className="hero-subtitle" style={{ marginTop: "1rem", lineHeight: "1.6" }}>
          {profileData.tagline}
        </p>

        <div className="hero-buttons">
          <a href="#projects" className="btn-primary">
            View My Projects
          </a>
          <a
            href={profileData.resumeUrl || "/Merlin_Stuwart_Resume.pdf"}
            download="Merlin_Stuwart_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ border: "1px solid var(--accent-light)", color: "#4ade80" }}
          >
            <FaDownload /> Download CV
          </a>
          <a
            href={profileData.github}
            className="btn-ghost"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href={profileData.linkedin}
            className="btn-ghost"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin /> LinkedIn
          </a>
        </div>

        <div className="hero-meta" style={{ marginTop: "1.2rem" }}>
          <span>📍 {profileData.location}</span>
          <span>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profileData.email)}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
              title="Open in Gmail"
            >
              <FaEnvelope style={{ marginRight: "0.3rem" }} /> {profileData.email}
            </a>
          </span>
          <span><FaPhoneAlt style={{ marginRight: "0.3rem" }} /> {profileData.phone}</span>
        </div>
      </motion.div>

      {/* RIGHT SIDE DUAL-PHOTO CAROUSEL & IMPRESSIVE CYBER CARD */}
      <motion.div
        className="hero-right"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Futuristic Cyber Card Orbit Wrapper */}
        <div className="cyber-card-wrapper">
          {/* Ambient Glow Aura Behind Photo */}
          <div className="cyber-glow-aura" />

          {/* Outer Rotating HUD Radar Circle */}
          <div className="cyber-hud-orbit" />

          {/* Main Large Cyber Squircle Photo Frame Card */}
          <div
            className="cyber-photo-card"
            onClick={() => handlePhotoSwitch()}
            title="Click photo to switch with animated effect!"
          >
            {/* Cyber Scanner Laser Line */}
            <div className="cyber-scanner-beam" />

            {/* Corner Tech HUD Accents */}
            <div className="hud-corner top-left" />
            <div className="hud-corner top-right" />
            <div className="hud-corner bottom-left" />
            <div className="hud-corner bottom-right" />

            <AnimatePresence mode="wait">
              <motion.img
                key={activePhoto + "_" + currentPhotoUrl + "_" + currentActiveEffect}
                src={currentPhotoUrl}
                alt={profileData.name}
                initial={currentVariants.initial}
                animate={currentVariants.animate}
                exit={currentVariants.exit}
                transition={currentVariants.transition}
                className="cyber-photo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = activePhoto === 1 ? "/profile1.png" : "/profile2.png";
                }}
              />
            </AnimatePresence>

            {/* Cyber Frame Bottom Info Overlay */}
            <div className="cyber-photo-overlay">
              <span className="photo-caption">
                {activePhoto === 1 ? "Merlin Stewart • Profile 01" : "Merlin Stewart • Profile 02"}
              </span>
            </div>
          </div>

          {/* Floating HUD Chip 1 — Top Left */}
          <motion.div
            initial={{ y: -8 }}
            animate={{ y: 8 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="hero-tag-chip chip-left"
          >
            🤖 AI Architect
          </motion.div>

          {/* Floating HUD Chip 2 — Top Right */}
          <motion.div
            initial={{ y: 8 }}
            animate={{ y: -8 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="hero-tag-chip chip-right"
          >
            ~40% Response Cut 🚀
          </motion.div>

          {/* Floating HUD Chip 3 — Bottom Right */}
          <motion.div
            initial={{ x: -6 }}
            animate={{ x: 6 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="hero-tag-chip chip-bottom"
          >
            ⚡ RAG & LLMs
          </motion.div>
        </div>

        {/* PHOTO TOGGLE & EFFECT SELECTOR */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1.4rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(15, 23, 42, 0.75)",
              padding: "0.4rem 0.8rem",
              borderRadius: "999px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
            }}
          >
            <button
              onClick={() => handlePhotoSwitch(1)}
              style={{
                padding: "0.28rem 0.75rem",
                borderRadius: "999px",
                border: "none",
                background: activePhoto === 1 ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "transparent",
                color: activePhoto === 1 ? "#fff" : "#9ca3af",
                fontSize: "0.78rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              📷 Photo 1
            </button>
            <button
              onClick={() => handlePhotoSwitch(2)}
              style={{
                padding: "0.28rem 0.75rem",
                borderRadius: "999px",
                border: "none",
                background: activePhoto === 2 ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "transparent",
                color: activePhoto === 2 ? "#fff" : "#9ca3af",
                fontSize: "0.78rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              📸 Photo 2
            </button>
          </div>

          {/* ANIMATION EFFECT SELECTOR (ONLY VISIBLE IN ADMIN MODE) */}
          {isAdmin && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                background: "rgba(2, 6, 23, 0.75)",
                padding: "0.25rem 0.6rem",
                borderRadius: "999px",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                fontSize: "0.72rem",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: "0.7rem", fontWeight: "600", marginRight: "0.1rem" }}>
                Effect:
              </span>
              <button
                onClick={() => setPhotoEffect("random")}
                style={{
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  border: "none",
                  background: photoEffect === "random" ? "rgba(236, 72, 153, 0.35)" : "transparent",
                  color: photoEffect === "random" ? "#f472b6" : "#9ca3af",
                  cursor: "pointer",
                  fontWeight: photoEffect === "random" ? "700" : "500",
                  fontSize: "0.72rem",
                }}
                title="Random Effect on Every Click"
              >
                🔀 Random
              </button>
              <button
                onClick={() => setPhotoEffect("glitch")}
                style={{
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  border: "none",
                  background: photoEffect === "glitch" ? "rgba(34, 197, 94, 0.3)" : "transparent",
                  color: photoEffect === "glitch" ? "#4ade80" : "#9ca3af",
                  cursor: "pointer",
                  fontWeight: photoEffect === "glitch" ? "700" : "500",
                  fontSize: "0.72rem",
                }}
                title="Cyberpunk Glitch Effect"
              >
                ⚡ Glitch
              </button>
              <button
                onClick={() => setPhotoEffect("flip")}
                style={{
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  border: "none",
                  background: photoEffect === "flip" ? "rgba(56, 189, 248, 0.3)" : "transparent",
                  color: photoEffect === "flip" ? "#38bdf8" : "#9ca3af",
                  cursor: "pointer",
                  fontWeight: photoEffect === "flip" ? "700" : "500",
                  fontSize: "0.72rem",
                }}
                title="3D Flip / Roll Effect"
              >
                🔄 3D Roll
              </button>
              <button
                onClick={() => setPhotoEffect("slide")}
                style={{
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  border: "none",
                  background: photoEffect === "slide" ? "rgba(168, 85, 247, 0.3)" : "transparent",
                  color: photoEffect === "slide" ? "#c084fc" : "#9ca3af",
                  cursor: "pointer",
                  fontWeight: photoEffect === "slide" ? "700" : "500",
                  fontSize: "0.72rem",
                }}
                title="Holographic Slide Effect"
              >
                🌊 Slide
              </button>
              <button
                onClick={() => setPhotoEffect("zoom")}
                style={{
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  border: "none",
                  background: photoEffect === "zoom" ? "rgba(251, 146, 60, 0.3)" : "transparent",
                  color: photoEffect === "zoom" ? "#fb923c" : "#9ca3af",
                  cursor: "pointer",
                  fontWeight: photoEffect === "zoom" ? "700" : "500",
                  fontSize: "0.72rem",
                }}
                title="Particle Zoom Flash Effect"
              >
                ✨ Zoom
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* HERO EDIT MODAL */}
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
                maxWidth: "520px",
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
                Edit Profile & Photos
              </h2>

              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* PHOTO UPLOAD BOXES WITH BACKEND REPLACEMENT ENDPOINT */}
                <div style={{ background: "rgba(2, 6, 23, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1rem" }}>
                  <h4 style={{ fontSize: "0.9rem", color: "#38bdf8", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FaCamera /> Permanent File Replacement Upload
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                        Replace profile1.png
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUploadToServer(e, "avatar1")}
                        style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                        Replace profile2.png
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUploadToServer(e, "avatar2")}
                        style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                      />
                    </div>
                  </div>
                  {uploadStatus && (
                    <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", fontWeight: "600", color: "#4ade80" }}>
                      {uploadStatus}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
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
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={tempProfile.role}
                    onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
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
                    Tagline
                  </label>
                  <textarea
                    rows={3}
                    value={tempProfile.tagline}
                    onChange={(e) => setTempProfile({ ...tempProfile, tagline: e.target.value })}
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
                      Location
                    </label>
                    <input
                      type="text"
                      value={tempProfile.location}
                      onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
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
                      Phone
                    </label>
                    <input
                      type="text"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
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
                  <FaSave /> Save Profile Info & Photos
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Hero;
