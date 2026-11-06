import React, { useState } from "react";
import { usePortfolio } from "../data/PortfolioContext";
import { FaLock, FaKey, FaSignOutAlt, FaShieldAlt, FaTimes, FaUndo, FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function AdminControlModal({ isOpen, onClose }) {
  const { isAdmin, loginAdmin, logoutAdmin, resetToDefault, changeAdminPin } = usePortfolio();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Change PIN State
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinSuccessMsg, setPinSuccessMsg] = useState("");

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
    if (!newPin || newPin.length < 4) {
      setError("Passcode must be at least 4 digits/characters!");
      return;
    }
    if (newPin !== confirmPin) {
      setError("Passcodes do not match!");
      return;
    }

    await changeAdminPin(newPin);
    setPinSuccessMsg("Secret Passcode changed permanently on Express Server!");
    setError("");
    setNewPin("");
    setConfirmPin("");
    setTimeout(() => {
      setPinSuccessMsg("");
      setIsChangingPin(false);
    }, 2000);
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
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsChangingPin(false);
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
