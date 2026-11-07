import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { API_BASE_URL } from "../config";
import { FaLock, FaKey, FaSignOutAlt, FaShieldAlt, FaTimes, FaUndo, FaCog, FaEnvelope, FaTrash, FaReply, FaArrowLeft, FaArchive } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function AdminControlModal({ isOpen, onClose }) {
  const { isAdmin, loginAdmin, logoutAdmin, resetToDefault, changeAdminPin } = usePortfolio();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Change PIN State
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinSuccessMsg, setPinSuccessMsg] = useState("");

  // Inquiries / Messages State
  const [isViewingMessages, setIsViewingMessages] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [archivesList, setArchivesList] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);

  const fetchMessages = async () => {
    setMsgLoading(true);
    let combined = [];
    let archives = [];

    // 1. Load from browser LocalStorage first
    try {
      const local = JSON.parse(localStorage.getItem("portfolio_local_messages") || "[]");
      if (Array.isArray(local)) {
        combined = [...local];
      }
    } catch (e) {
      console.warn("Could not read local messages:", e);
    }

    // 2. Fetch from backend API (if server is active)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        archives = data.archives || [];
        const seen = new Set(combined.map((m) => m.id));
        data.messages.forEach((m) => {
          if (!seen.has(m.id)) {
            combined.push(m);
            seen.add(m.id);
          }
        });
      }
    } catch (err) {
      console.warn("Backend offline or unreachable, showing local storage messages:", err);
    }

    // Sort by timestamp descending
    combined.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    setMessagesList(combined);
    setArchivesList(archives);
    setMsgLoading(false);
  };

  const handleOpenMessages = () => {
    setIsViewingMessages(true);
    fetchMessages();
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    // Remove from LocalStorage
    try {
      const local = JSON.parse(localStorage.getItem("portfolio_local_messages") || "[]");
      const updated = local.filter((m) => m.id !== id);
      localStorage.setItem("portfolio_local_messages", JSON.stringify(updated));
    } catch (e) {}

    // Update state
    setMessagesList((prev) => prev.filter((m) => m.id !== id));

    // Remove from Backend (if reachable)
    try {
      await fetch(`${API_BASE_URL}/api/admin/messages/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Backend delete skipped:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await loginAdmin(pin);
    if (success) {
      setPin("");
      setError("");
      onClose();
    } else {
      setError("Incorrect Access Key!");
    }
  };

  const handleChangePinSubmit = async (e) => {
    e.preventDefault();

    if (!currentPin) {
      setError("Please enter your current passcode!");
      return;
    }

    if (!newPin || newPin.length < 8) {
      setError("Passcode must be at least 8 characters!");
      return;
    }

    if (newPin !== confirmPin) {
      setError("Passcodes do not match!");
      return;
    }

    const success = await changeAdminPin(currentPin, newPin);

    if (success) {
      setPinSuccessMsg("Secret Passcode changed successfully!");
      setError("");
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");

      setTimeout(() => {
        setPinSuccessMsg("");
        setIsChangingPin(false);
      }, 2000);
    } else {
      setError("Current passcode is incorrect or update failed!");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "rgba(2, 6, 23, 0.88)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            background: "#0f172a",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: "20px",
            padding: "2.2rem 2rem",
            maxWidth: isViewingMessages ? "620px" : "420px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsChangingPin(false);
              setIsViewingMessages(false);
              onClose();
            }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
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

          {!isAdmin ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  marginBottom: "1.2rem",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#38bdf8",
                    fontSize: "1.2rem",
                  }}
                >
                  <FaLock />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", color: "#f3f4f6", fontWeight: "700" }}>
                    Security Access
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    Enter authorization code
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} style={{ marginTop: "1.2rem" }}>
                <div style={{ marginBottom: "1.2rem" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaKey
                      style={{
                        position: "absolute",
                        left: "14px",
                        color: "#64748b",
                      }}
                    />
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Passcode"
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "0.8rem 0.8rem 0.8rem 2.6rem",
                        background: "rgba(2, 6, 23, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>
                  {error && (
                    <span
                      style={{
                        color: "#ef4444",
                        fontSize: "0.8rem",
                        marginTop: "0.4rem",
                        display: "block",
                      }}
                    >
                      {error}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(56, 189, 248, 0.4)",
                  }}
                >
                  Verify Key
                </button>
              </form>
            </div>
          ) : isChangingPin ? (
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "#f3f4f6", fontWeight: "700", marginBottom: "0.4rem" }}>
                Change Secret Passcode
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.2rem" }}>
                Enter your new passcode below
              </p>

              <form onSubmit={handleChangePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Current Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="Enter current passcode"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    New Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter new passcode"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                    Confirm New Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Re-enter new passcode"
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      background: "rgba(2, 6, 23, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                {error && <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>{error}</span>}
                {pinSuccessMsg && <span style={{ color: "#4ade80", fontSize: "0.85rem", fontWeight: "600" }}>{pinSuccessMsg}</span>}

                <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(false)}
                    style={{
                      flex: 1,
                      padding: "0.7rem",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "none",
                      color: "#cbd5e1",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "0.7rem",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                      border: "none",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Update Key
                  </button>
                </div>
              </form>
            </div>
          ) : isViewingMessages ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <button
                  onClick={() => setIsViewingMessages(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "none",
                    color: "#cbd5e1",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <FaArrowLeft /> Back
                </button>
                <div style={{ fontSize: "0.8rem", color: "#38bdf8", fontWeight: "600" }}>
                  Active: messages.json ({messagesList.length}/50)
                </div>
              </div>

              <h3 style={{ fontSize: "1.2rem", color: "#f3f4f6", fontWeight: "700", marginBottom: "0.3rem" }}>
                📬 Received Contact Inquiries
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1rem" }}>
                Inquiries saved securely in the backend. Old records auto-rotate to keep file lightweight.
              </p>

              {archivesList.length > 0 && (
                <div
                  style={{
                    background: "rgba(56, 189, 248, 0.1)",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.8rem",
                    fontSize: "0.75rem",
                    color: "#7dd3fc",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <FaArchive /> Archived chunks on disk: {archivesList.join(", ")}
                </div>
              )}

              {msgLoading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                  Loading inquiries...
                </div>
              ) : messagesList.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2.5rem 1rem",
                    color: "#9ca3af",
                    background: "rgba(2, 6, 23, 0.4)",
                    borderRadius: "12px",
                    border: "1px dashed rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
                  <div style={{ fontWeight: "600", color: "#cbd5e1" }}>No Inquiries Yet</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
                    When visitors submit the contact form, messages will appear here.
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxHeight: "55vh", overflowY: "auto", paddingRight: "0.3rem" }}>
                  {messagesList.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        background: "rgba(2, 6, 23, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        padding: "1rem",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <div>
                          <div style={{ fontWeight: "700", color: "#f3f4f6", fontSize: "0.95rem" }}>
                            {msg.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#38bdf8", marginTop: "0.1rem" }}>
                            {msg.email}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <a
                            href={`mailto:${encodeURIComponent(msg.email)}?subject=Re: Portfolio Inquiry&body=Hi ${encodeURIComponent(msg.name)},\n\n`}
                            style={{
                              padding: "0.3rem 0.6rem",
                              borderRadius: "6px",
                              background: "rgba(56, 189, 248, 0.2)",
                              border: "1px solid rgba(56, 189, 248, 0.4)",
                              color: "#38bdf8",
                              fontSize: "0.75rem",
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                            title="Reply to visitor"
                          >
                            <FaReply /> Reply
                          </a>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            style={{
                              padding: "0.3rem 0.5rem",
                              borderRadius: "6px",
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "#f87171",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                            title="Delete inquiry"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          background: "rgba(15, 23, 42, 0.6)",
                          padding: "0.7rem",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          color: "#cbd5e1",
                          lineHeight: "1.5",
                          whiteSpace: "pre-wrap",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        {msg.message}
                      </div>

                      <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.4rem", textAlign: "right" }}>
                        {msg.dateStr || new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(74, 222, 128, 0.15)",
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4ade80",
                  fontSize: "1.6rem",
                  margin: "0 auto 1rem auto",
                }}
              >
                <FaShieldAlt />
              </div>
              <h3 style={{ fontSize: "1.3rem", color: "#f3f4f6", fontWeight: "700" }}>
                Admin Mode Active
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                  marginTop: "0.4rem",
                  marginBottom: "1.8rem",
                }}
              >
                Editing controls unlocked across all sections.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <button
                  onClick={handleOpenMessages}
                  style={{
                    padding: "0.8rem",
                    borderRadius: "10px",
                    background: "rgba(34, 197, 94, 0.18)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    color: "#4ade80",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
                  }}
                >
                  <FaEnvelope /> 📬 View Inquiries & Messages
                </button>

                <button
                  onClick={() => setIsChangingPin(true)}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaCog /> Change Secret Passcode
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset all portfolio data to default?")) {
                      resetToDefault();
                      alert("Portfolio data reset to default!");
                    }
                  }}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#f87171",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaUndo /> Reset Portfolio Data to Default
                </button>

                <button
                  onClick={() => {
                    logoutAdmin();
                    onClose();
                  }}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#e2e8f0",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaSignOutAlt /> Exit Admin Mode
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdminControlModal;
