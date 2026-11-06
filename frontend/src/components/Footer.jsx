import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaArrowUp, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";

function Footer({ name }) {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        position: "relative",
        background: "linear-gradient(180deg, rgba(9, 13, 22, 0.4) 0%, rgba(2, 6, 23, 0.95) 100%)",
        borderTop: "1px solid rgba(56, 189, 248, 0.15)",
        backdropFilter: "blur(16px)",
        padding: "3.5rem 1.5rem 2rem 1.5rem",
        marginTop: "4rem",
        overflow: "hidden"
      }}
    >
      {/* Top Ambient Glow Line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)",
          boxShadow: "0 0 15px #38bdf8"
        }}
      />

      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2.5rem",
          marginBottom: "2.5rem"
        }}
      >
        {/* Column 1: Brand & Status */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0284c7, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "1.1rem",
                color: "#fff",
                boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)"
              }}
            >
              MS
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#f3f4f6" }}>
                {name || "Merlin Stuwart"}
              </h3>
              <span style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: "500" }}>
                AI/ML & Full-Stack Engineer
              </span>
            </div>
          </div>

          <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.2rem" }}>
            Building high-performance web apps, RAG vector search pipelines, and automated business workflows.
          </p>

          {/* Live Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              padding: "0.4rem 0.8rem",
              borderRadius: "999px",
              fontSize: "0.78rem",
              color: "#4ade80",
              fontWeight: "600"
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
                animation: "pulse 2s infinite"
              }}
            />
            Available for Full-Time Roles
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ color: "#f3f4f6", fontSize: "1rem", fontWeight: "700", marginBottom: "1rem" }}>
            Quick Navigation
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
            {[
              { label: "Home", href: "#home" },
              { label: "About Me", href: "#about" },
              { label: "Skills & Tech", href: "#skills" },
              { label: "Experience", href: "#experience" },
              { label: "Projects", href: "#projects" },
              { label: "Contact", href: "#contact" }
            ].map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  style={{
                    color: "#9ca3af",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                    transition: "color 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#38bdf8")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  → {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Social & Connect */}
        <div>
          <h4 style={{ color: "#f3f4f6", fontSize: "1rem", fontWeight: "700", marginBottom: "1rem" }}>
            Connect & Socials
          </h4>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Feel free to connect on GitHub, LinkedIn, or send a direct email.
          </p>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {[
              { icon: <FaGithub />, href: "https://github.com/MerlinStuwart", title: "GitHub" },
              { icon: <FaLinkedin />, href: "https://linkedin.com/in/merlinstuwart", title: "LinkedIn" },
              { icon: <FaEnvelope />, href: "mailto:merlinstuwart.w@gmail.com", title: "Email" },
              { icon: <FaWhatsapp />, href: "https://wa.me/916379113226", title: "WhatsApp" }
            ].map((soc, i) => (
              <motion.a
                key={i}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                title={soc.title}
                whileHover={{ y: -3, scale: 1.1 }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8",
                  fontSize: "1.1rem",
                  textDecoration: "none"
                }}
              >
                {soc.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          fontSize: "0.85rem",
          color: "#9ca3af"
        }}
      >
        <div>
          © {year} <span style={{ color: "#f3f4f6", fontWeight: "600" }}>{name || "Merlin Stuwart"}</span>. All rights reserved.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#818cf8" }}>
          <FaCode /> “Code • Learn • Ship” — dev mantra
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          style={{
            background: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            color: "#38bdf8",
            padding: "0.45rem 0.9rem",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.25s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#38bdf8";
            e.currentTarget.style.color = "#090d16";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(56, 189, 248, 0.15)";
            e.currentTarget.style.color = "#38bdf8";
          }}
        >
          Top <FaArrowUp />
        </button>
      </div>
    </footer>
  );
}

export default Footer;
