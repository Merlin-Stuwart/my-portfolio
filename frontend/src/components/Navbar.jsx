import React, { useState, useEffect } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import AdminControlModal from "./AdminControlModal";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUser,
  FaLaptopCode,
  FaBriefcase,
  FaRocket,
  FaChartBar,
  FaEnvelope,
  FaPaperPlane,
  FaShieldAlt,
  FaPalette,
  FaFire,
  FaBolt,
  FaWater,
  FaTree,
  FaCheck,
  FaChevronDown,
} from "react-icons/fa";

const links = [
  { id: "home", label: "Home", icon: FaHome },
  { id: "about", label: "About", icon: FaUser },
  { id: "skills", label: "Skills", icon: FaLaptopCode },
  { id: "experience", label: "Experience", icon: FaBriefcase },
  { id: "projects", label: "Projects", icon: FaRocket },
  { id: "stats", label: "Stats", icon: FaChartBar },
  { id: "contact", label: "Contact", icon: FaEnvelope },
];

function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { profileData, isAdmin, setIsAdmin, theme, setTheme } = usePortfolio();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const scrollPos = window.scrollY + 200;

      links.forEach((l) => {
        const section = document.getElementById(l.id);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;

          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(l.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // HIDDEN SECRET KEYBOARD SHORTCUT: (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close theme menu on click outside
  useEffect(() => {
    if (!isThemeMenuOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".theme-dropdown-container")) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isThemeMenuOpen]);

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* MODULE 1: BRAND CARD (Left) */}
          <div
            className="nav-brand-card"
            onClick={(e) => {
              if (e.detail === 3) {
                setIsAdminModalOpen(true);
              } else {
                scrollToSection("home");
              }
            }}
            title="Click to Scroll Home | Triple Click for Admin"
          >
            <div className="stylish-nav-logo">
              <span className="logo-initials">MS</span>
              <span className="online-dot" title="Available for Work" />
              <span className="online-ping" />
            </div>
            <div className="nav-brand-text">
              <div className="nav-brand-name">
                {profileData.name}
                <span className="nav-live-badge">• Live</span>
              </div>
              <div className="nav-brand-status">AI & Full-Stack Architect</div>
            </div>
          </div>

          {/* MODULE 2: FLOATING NAV DOCK (Center) */}
          <nav className="nav-center-dock">
            {links.map((l) => {
              const Icon = l.icon;
              const isActive = activeSection === l.id;

              return (
                <button
                  key={l.id}
                  onClick={() => scrollToSection(l.id)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="active-pill-bg"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="nav-icon">
                    <Icon />
                  </span>
                  <span className="nav-label">{l.label}</span>
                </button>
              );
            })}
          </nav>

          {/* MODULE 3: QUICK ACTIONS CARD (Right) */}
          <div className="nav-actions-card">
            {/* THEME SWITCHER DROPDOWN */}
            <div className="theme-dropdown-container">
              <button
                className={`nav-theme-btn ${
                  theme === "fire"
                    ? "theme-fire-btn"
                    : theme === "water"
                    ? "theme-water-btn"
                    : theme === "forest"
                    ? "theme-forest-btn"
                    : ""
                }`}
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                title="Switch Portfolio Theme"
                aria-label="Switch Theme"
              >
                <FaPalette className="theme-btn-icon" />
                <span className="theme-btn-text">Themes</span>
                <FaChevronDown
                  className={`theme-caret ${isThemeMenuOpen ? "open" : ""}`}
                />
              </button>

              {isThemeMenuOpen && (
                <div className="theme-dropdown-menu">
                  <div className="theme-dropdown-header">Select Theme</div>

                  <button
                    className={`theme-option ${theme === "cyber" ? "active" : ""}`}
                    onClick={() => {
                      setTheme("cyber");
                      setIsThemeMenuOpen(false);
                    }}
                  >
                    <div className="theme-option-info">
                      <FaBolt className="theme-opt-icon cyber-opt" />
                      <span>Cyber Neon</span>
                    </div>
                    {theme === "cyber" && <FaCheck className="theme-check" />}
                  </button>

                  <button
                    className={`theme-option ${theme === "fire" ? "active" : ""}`}
                    onClick={() => {
                      setTheme("fire");
                      setIsThemeMenuOpen(false);
                    }}
                  >
                    <div className="theme-option-info">
                      <FaFire className="theme-opt-icon fire-opt" />
                      <span>Fire / Lava</span>
                    </div>
                    {theme === "fire" && <FaCheck className="theme-check" />}
                  </button>

                  <button
                    className={`theme-option ${theme === "water" ? "active" : ""}`}
                    onClick={() => {
                      setTheme("water");
                      setIsThemeMenuOpen(false);
                    }}
                  >
                    <div className="theme-option-info">
                      <FaWater className="theme-opt-icon water-opt" />
                      <span>Water / Ocean</span>
                    </div>
                    {theme === "water" && <FaCheck className="theme-check" />}
                  </button>

                  <button
                    className={`theme-option ${theme === "forest" ? "active" : ""}`}
                    onClick={() => {
                      setTheme("forest");
                      setIsThemeMenuOpen(false);
                    }}
                  >
                    <div className="theme-option-info">
                      <FaTree className="theme-opt-icon forest-opt" style={{ color: "#10b981" }} />
                      <span>Forest / Nature</span>
                    </div>
                    {theme === "forest" && <FaCheck className="theme-check" />}
                  </button>
                </div>
              )}
            </div>

            {isAdmin && (
              <button
                className="nav-admin-badge"
                onClick={() => setIsAdminModalOpen(true)}
                title="Click to Open Admin Control Center"
              >
                <FaShieldAlt /> Admin Mode
              </button>
            )}

            <button
              className="nav-cta-btn"
              onClick={() => scrollToSection("contact")}
            >
              <FaPaperPlane className="cta-icon" />
              <span>Hire Me</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hidden Admin Modal */}
      <AdminControlModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
