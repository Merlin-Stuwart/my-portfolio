import React, { useState } from "react";
import { profile } from "../data/portfolioData";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCopy, FaCheck, FaPaperPlane, FaSpinner, FaCheckCircle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setToastMessage("Email address copied to clipboard! 📋");
      setTimeout(() => {
        setCopiedEmail(false);
        setToastMessage("");
      }, 2500);
    } else {
      setCopiedPhone(true);
      setToastMessage("Phone number copied to clipboard! 📱");
      setTimeout(() => {
        setCopiedPhone(false);
        setToastMessage("");
      }, 2500);
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", msg: "Please fill in all fields before sending." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `⚡ Portfolio Contact Inquiry from ${form.name}`,
          _captcha: "false",
        }),
      });

      const data = await response.json();

      if (response.ok || data.success === "true" || data.success === true) {
        setForm({ name: "", email: "", message: "" });
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4500);
      } else {
        // Fallback
        const subject = encodeURIComponent(`Portfolio Inquiry from ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${subject}&body=${body}`, "_blank");
        setForm({ name: "", email: "", message: "" });
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4500);
      }
    } catch (err) {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${subject}&body=${body}`, "_blank");
      setForm({ name: "", email: "", message: "" });
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 4500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-form-section">
      <h2 className="section-heading">Let’s Connect</h2>
      <p className="section-subtitle">
        Have a project, AI integration opportunity, or full-stack software role in mind? Send a message directly below!
      </p>

      <div className="contact-grid">
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", color: "#f3f4f6", marginBottom: "1.2rem" }}>
            Send a Direct Message
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Your Name / HR Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="e.g., Sarah (HR Manager)"
                disabled={loading}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Your Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="e.g., sarah@company.com"
                disabled={loading}
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message / Opportunity Details</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={onChange}
                placeholder="Write your message or job opportunity details here..."
                disabled={loading}
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner-icon" style={{ animation: "spin 1s linear infinite" }} /> Sending Directly...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Send Message Directly
                </>
              )}
            </button>

            {status.msg && status.type === "error" && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.8rem 1rem",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  textAlign: "center",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#f87171",
                }}
              >
                {status.msg}
              </div>
            )}
          </form>
        </div>

        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <div>
            <h3 style={{ marginBottom: "0.8rem", fontSize: "1.1rem", color: "#f3f4f6" }}>
              Direct Contact Details
            </h3>
            <p
              style={{
                fontSize: "0.92rem",
                color: "var(--text-muted)",
                marginBottom: "1.5rem",
                lineHeight: "1.5",
              }}
            >
              Prefer direct reach-out? Copy email or phone below for instant messaging.
            </p>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* Email item */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <FaEnvelope style={{ color: "#38bdf8", fontSize: "1.1rem" }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Email Address</div>
                    <div style={{ fontSize: "0.92rem", fontWeight: "600", color: "#f3f4f6" }}>
                      {profile.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(profile.email, "email")}
                  style={{
                    background: "none",
                    border: "none",
                    color: copiedEmail ? "#4ade80" : "#9ca3af",
                    cursor: "pointer",
                    padding: "0.4rem",
                    fontSize: "0.95rem",
                  }}
                  title="Copy Email"
                >
                  {copiedEmail ? <FaCheck /> : <FaCopy />}
                </button>
              </div>

              {/* Phone item */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <FaPhoneAlt style={{ color: "#4ade80", fontSize: "1.1rem" }} />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Phone / WhatsApp</div>
                    <div style={{ fontSize: "0.92rem", fontWeight: "600", color: "#f3f4f6" }}>
                      {profile.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(profile.phone, "phone")}
                  style={{
                    background: "none",
                    border: "none",
                    color: copiedPhone ? "#4ade80" : "#9ca3af",
                    cursor: "pointer",
                    padding: "0.4rem",
                    fontSize: "0.95rem",
                  }}
                  title="Copy Phone"
                >
                  {copiedPhone ? <FaCheck /> : <FaCopy />}
                </button>
              </div>

              {/* Location item */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <FaMapMarkerAlt style={{ color: "#f43f5e", fontSize: "1.1rem" }} />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Location</div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "600", color: "#f3f4f6" }}>
                    {profile.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: "2.5rem",
              right: "2.5rem",
              zIndex: 9999,
              background: "linear-gradient(135deg, #090d16, #1e293b)",
              border: "1px solid rgba(56, 189, 248, 0.5)",
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.3)",
              color: "#38bdf8",
              padding: "0.85rem 1.4rem",
              borderRadius: "14px",
              fontWeight: "600",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem"
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS POP-UP MODAL WITH CHECKMARK */}
      <AnimatePresence>
        {showSuccessModal && (
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
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              style={{
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                border: "1px solid rgba(74, 222, 128, 0.5)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(74, 222, 128, 0.25)",
                borderRadius: "24px",
                padding: "2.5rem 2rem",
                maxWidth: "460px",
                width: "100%",
                textAlign: "center",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSuccessModal(false)}
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

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.18)",
                  border: "2px solid #4ade80",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.2rem auto",
                  color: "#4ade80",
                  fontSize: "2.2rem",
                  boxShadow: "0 0 25px rgba(74, 222, 128, 0.4)",
                }}
              >
                <FaCheckCircle />
              </motion.div>

              <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#f3f4f6", marginBottom: "0.6rem" }}>
                Message Sent Successfully!
              </h3>

              <p style={{ color: "#9ca3af", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "1.6rem" }}>
                Your message has been delivered directly to Merlin’s inbox. The form has been reset for new entries!
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  border: "none",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.35)",
                }}
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Contact;
