// src/components/RecruiterCopilot.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FiCpu,
  FiX,
  FiSend,
  FiUserCheck,
  FiFileText,
  FiMail,
  FiCheckCircle,
  FiCopy,
  FiTarget,
  FiMessageSquare
} from "react-icons/fi";
import { usePortfolio } from "../data/PortfolioContext";
import { API_BASE_URL } from "../config";
import "./RecruiterCopilot.css";

const PRESET_QUESTIONS = [
  "What college did Merlin study in?",
  "What company is Merlin working at?",
  "Does Merlin know React.js & Python?",
  "Tell me about the WhatsApp bot project.",
  "What is Merlin's contact email & phone?"
];

export default function RecruiterCopilot() {
  const {
    profileData,
    summaryData,
    skillsData,
    experiencesData,
    projectsData,
    educationData,
    certificationsData
  } = usePortfolio();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'evaluator'
  const [copied, setCopied] = useState(false);
  const [inputMsg, setInputMsg] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: `Hi there! 👋 I'm **Alex**, ${profileData?.name || "Merlin"}'s Personal Career Assistant 🤖.\n\nAsk me about Merlin's college, current company, specific skills, projects, certifications, or contact info, and I will give you the exact details!`,
      time: "Just now"
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activeTab]);

  // Extract all active skill items into a flat list
  const allSkillsList = Array.isArray(skillsData)
    ? skillsData.flatMap((cat) => cat.items || [])
    : [];

  // Generate dynamic Role Evaluator array based on live skills context
  const dynamicRolesEvaluation = [
    {
      role: "Full-Stack Developer",
      matchScore: 98,
      reasons: [
        `1+ years hands-on experience building web apps with ${allSkillsList.slice(0, 4).join(", ") || "React.js, Python, & REST APIs"}.`,
        `Delivered ${projectsData.length || 0} production/featured projects including business bots & desktop tools.`,
        `Strong backend & database integrations (MySQL, MongoDB, Docker).`
      ],
      matchedSkills: allSkillsList.filter((s) =>
        ["React.js", "Python", "REST API Development", "JavaScript", "TypeScript", "HTML5", "CSS3", "Electron", "MySQL", "MongoDB", "Docker"].includes(s)
      ),
      keyProject: projectsData[0]?.title || "WhatsApp Business Automation Bot"
    },
    {
      role: "AI / ML & RAG Engineer",
      matchScore: 94,
      reasons: [
        "Built end-to-end RAG (Retrieval-Augmented Generation) pipelines & Vector DB integrations.",
        "Fine-tuned LLM models for domain-specific Q&A assistants (e.g. NEET Preparation Assistant).",
        "Integrated real-time AI intent classification into production client workflows."
      ],
      matchedSkills: allSkillsList.filter((s) =>
        ["Python", "Machine Learning", "LLM Fine-Tuning", "RAG Pipelines", "Vector Databases", "NLP", "Prompt Engineering"].includes(s)
      ),
      keyProject: projectsData.find((p) => (p.category || "").toLowerCase().includes("ai"))?.title || "NEET Preparation Assistant / RAG Tracker"
    },
    {
      role: "Python / Backend Engineer",
      matchScore: 96,
      reasons: [
        "Solid OOP & SDLC principles backed by hands-on Python development experience.",
        "Built production automation workflows cutting manual agent response time by ~40%.",
        "Containerized application services using Docker for 24/7 continuous uptime."
      ],
      matchedSkills: allSkillsList.filter((s) =>
        ["Python", "REST API Development", "MySQL", "MongoDB", "Docker", "Git/GitHub"].includes(s)
      ),
      keyProject: projectsData[0]?.title || "Autosherpa WhatsApp Automation Bot"
    }
  ];

  const [selectedRole, setSelectedRole] = useState(dynamicRolesEvaluation[0]);

  useEffect(() => {
    setSelectedRole(dynamicRolesEvaluation[0]);
  }, [skillsData, projectsData]);

  const [isThinking, setIsThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleQuestionSelect = (qText) => {
    setShowSuggestions(false);
    addUserMessage(qText);
    generateAiResponse(qText);
  };

  const addUserMessage = (text) => {
    const newMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // UNIVERSAL PRECISION ASSISTANT SEARCH ENGINE WITH REAL FREE AI MODEL API INTEGRATION
  const generateAiResponse = async (userQuery) => {
    const query = userQuery.toLowerCase().trim();
    setIsThinking(true);

    const respond = (text) => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    // Try Real Server-side Free AI Model Endpoint first
    try {
      const apiRes = await fetch(`${API_BASE_URL}/api/copilot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuery })
      });
      const data = await apiRes.json();
      if (data.success && data.response) {
        return respond(data.response);
      }
    } catch (e) {
      console.log("Server AI API offline/error, using local precision fallback:", e);
    }

    // LOCAL PRECISION RAG ASSISTANT FALLBACK ENGINE
    const hasWord = (...words) => words.some((w) => query.includes(w.toLowerCase()));

    const eduList = Array.isArray(educationData) ? educationData : [];
    const certList = Array.isArray(certificationsData) ? certificationsData : [];
    const expList = Array.isArray(experiencesData) ? experiencesData : [];
    const projList = Array.isArray(projectsData) ? projectsData : [];
    const skillsList = allSkillsList;

    // 1. SPECIFIC CONTACT / LOCATION / LINK QUERY MATCHING
    if (hasWord("mail id", "email id", "gmail", "email", "mail") && !hasWord("send", "compose")) {
      return respond(`Merlin's email address is **${profileData.email}** ✉️. You can click the Contact Email button below to send a direct message!`);
    }

    if (hasWord("phone", "mobile", "number", "contact number", "call", "whatsapp number")) {
      return respond(`Merlin's phone number is **${profileData.phone}** 📱.`);
    }

    if (hasWord("location", "where is", "where live", "city", "where located", "based in", "where from")) {
      return respond(`Merlin is currently based in **${profileData.location}** 📍.`);
    }

    if (hasWord("github")) {
      return respond(`Here is Merlin's GitHub profile link: **[${profileData.github}](${profileData.github})** 🐙.`);
    }

    if (hasWord("linkedin")) {
      return respond(`Here is Merlin's LinkedIn profile link: **[${profileData.linkedin}](${profileData.linkedin})** 🔗.`);
    }

    if (hasWord("resume", "cv", "pdf")) {
      return respond(`You can view or download Merlin's official resume here: **[Download Resume PDF](${profileData.resumeUrl || "/Merlin_Stuwart_Resume.pdf"})** 📄.`);
    }

    // 2. SPECIFIC EDUCATION / COLLEGE / UNIVERSITY MATCHING
    if (hasWord("college", "university", "school", "studied in", "degree", "graduation", "study", "avit", "aarupadi", "vasavi")) {
      const avitEdu = eduList.find(e => e.institution.toLowerCase().includes("aarupadi") || e.institution.toLowerCase().includes("avit") || e.degree.toLowerCase().includes("computer science"));
      const schoolEdu = eduList.find(e => e.institution.toLowerCase().includes("vasavi") || e.degree.toLowerCase().includes("12th") || e.degree.toLowerCase().includes("secondary"));

      if (hasWord("12th", "school", "vasavi", "secondary") && schoolEdu) {
        return respond(`Merlin completed his ${schoolEdu.degree} from **${schoolEdu.institution}** (${schoolEdu.year}) 🏫.`);
      }

      if (avitEdu) {
        return respond(`Merlin graduated with a **${avitEdu.degree}** from **${avitEdu.institution}** (${avitEdu.year}) 🎓.`);
      }

      return respond(`Merlin holds a **${eduList[0]?.degree || "B.E. / B.Tech in CSE"}** from **${eduList[0]?.institution || "Aarupadi Veedu Institute of Technology, Chennai"}** (${eduList[0]?.year || "2019 – 2023"}) 🎓.`);
    }

    // 3. SPECIFIC COMPANY / WORK EXPERIENCE MATCHING
    if (hasWord("company", "work at", "working at", "wyzmindz", "salesforce", "employer", "experience at", "internship", "job history")) {
      const wyz = expList.find(e => e.company.toLowerCase().includes("wyzmindz"));
      const sf = expList.find(e => e.company.toLowerCase().includes("salesforce"));

      if (hasWord("salesforce") && sf) {
        return respond(`Merlin completed a **${sf.title}** at **${sf.company}** (${sf.year}). He supported project management teams tracking Salesforce CRM deliverables.`);
      }

      if (wyz) {
        return respond(`Merlin is currently working as a **${wyz.title}** at **${wyz.company}** (${wyz.year}) 💼. He built a production client WhatsApp automation bot cutting response time by ~40%.`);
      }

      if (expList.length > 0) {
        return respond(`Merlin currently works at **${expList[0].company}** as a **${expList[0].title}** (${expList[0].year}).`);
      }
    }

    // 4. SPECIFIC CERTIFICATION MATCHING
    const matchedCert = certList.find(c => {
      const cLow = c.toLowerCase();
      return query.split(" ").some(w => w.length > 3 && cLow.includes(w)) || cLow.includes(query);
    });

    if (matchedCert || hasWord("certification", "certifications", "certificate", "certificates", "certified", "swaraj", "power bi", "jspiders", "n8n", "course", "courses")) {
      if (hasWord("energy", "swaraj")) {
        return respond(`Yes! Merlin completed the **Energy Swaraj Course** certification 🏅.`);
      }
      if (hasWord("power bi", "powerbi")) {
        return respond(`Yes! Merlin is **Microsoft Power BI Certified** 📊.`);
      }
      if (hasWord("jspiders", "jspider", "python full stack")) {
        return respond(`Yes! Merlin completed **Python Full Stack Development** training at **JSpiders** (2023–2024) 🐍.`);
      }
      if (hasWord("n8n")) {
        return respond(`Yes! Merlin holds the **n8n Yellow Belt Certification** for workflow automation ⚡.`);
      }
      if (matchedCert) {
        return respond(`Yes! Merlin holds the **${matchedCert}** certification 🏅.`);
      }
      const certItems = certList.length > 0 ? certList.map(c => `• **${c}**`).join("\n") : "• Energy Swaraj Course\n• Microsoft Power BI Certified\n• Python Full Stack (JSpiders)\n• n8n Yellow Belt Certification";
      return respond(`Yes! Merlin holds several key professional certifications 🏅:\n\n${certItems}`);
    }

    // 5. SPECIFIC SKILL / TECH STACK MATCHING (Checks skill keywords before project fallback)
    const matchedSkills = skillsList.filter((s) => {
      const sLow = s.toLowerCase();
      if (sLow.length <= 1) return false;
      return query.includes(sLow);
    });

    if (
      matchedSkills.length > 0 ||
      hasWord("react", "python", "docker", "node", "fastapi", "mysql", "mongodb", "typescript", "javascript", "rag", "llm")
    ) {
      if (hasWord("react") && hasWord("python")) {
        return respond(`Yes, absolutely! Merlin is highly proficient in both **React.js** and **Python** ⚛️🐍.\n\nHe uses **Python** for backend REST APIs, AI/ML RAG pipelines, and LLM fine-tuning, and **React.js** for building full-stack web applications, interactive UI dashboards, and desktop tools (including this portfolio!).`);
      }

      if (matchedSkills.length > 1) {
        const formattedSkills = matchedSkills.map((s) => `**${s}**`).join(" & ");
        return respond(`Yes, absolutely! Merlin has strong hands-on experience in ${formattedSkills} ⚡.\n\nHe applies these technologies in production for building full-stack applications, REST APIs, and AI/ML automation pipelines!`);
      }

      if (hasWord("react")) {
        return respond(`Yes, absolutely! Merlin is highly proficient in **React.js** ⚛️. He has over a year of hands-on experience building dynamic web frontends, interactive UI components, state management, and real-time dashboards using React.js. In fact, this entire portfolio app is built with React!`);
      }

      if (hasWord("python")) {
        return respond(`Yes, definitely! **Python** 🐍 is one of Merlin's core strengths. He uses Python extensively for building REST APIs, AI/ML RAG pipelines, LLM fine-tuning, and production automation bots!`);
      }

      if (hasWord("docker")) {
        return respond(`Yes! Merlin uses **Docker** 🐳 for containerizing backend applications, database microservices, and WhatsApp bot instances for seamless 24/7 cloud server deployment.`);
      }

      if (matchedSkills.length === 1) {
        return respond(`Yes! Merlin has active hands-on proficiency in **${matchedSkills[0]}** 👍. It is a core part of his technical toolkit at Wyzmindz Solutions!`);
      }
    }

    // 6. EXPLICIT PROJECT MATCHING (Only triggered when specifically asking about projects/bots)
    if (hasWord("project", "projects", "bot", "bots", "whatsapp", "autosherpa", "desktop app", "neet", "suryajosvi", "reflection")) {
      if (hasWord("whatsapp", "bot", "autosherpa")) {
        const p = projList.find(x => x.id === "autosherpa-bot" || x.title.toLowerCase().includes("whatsapp business")) || projList[0];
        return respond(`**${p.title}**: ${p.description}\n\n• **Impact:** Cut manual agent response time by ~40% in production.\n• **Tech Stack:** ${Array.isArray(p.tech) ? p.tech.join(", ") : p.tech}.`);
      }
      if (hasWord("desktop", "electron")) {
        const p = projList.find(x => x.id === "whatsapp-desktop-app" || x.title.toLowerCase().includes("desktop")) || projList[1];
        return respond(`**${p.title}**: ${p.description}\n\n• **Tech Stack:** ${Array.isArray(p.tech) ? p.tech.join(", ") : p.tech}.`);
      }
      if (hasWord("neet", "fine-tune", "fine tuned")) {
        const p = projList.find(x => x.id === "neet-llm-assistant" || x.title.toLowerCase().includes("neet")) || projList[2];
        return respond(`**${p.title}**: ${p.description}\n\n• **Tech Stack:** ${Array.isArray(p.tech) ? p.tech.join(", ") : p.tech}.`);
      }
      if (hasWord("suryajosvi", "reflection", "rag tracker")) {
        const p = projList.find(x => x.id === "suryajosvi-reflection-tracker" || x.title.toLowerCase().includes("reflection")) || projList[3];
        return respond(`**${p.title}**: ${p.description}\n\n• **Tech Stack:** ${Array.isArray(p.tech) ? p.tech.join(", ") : p.tech}.`);
      }
      const matchedProj = projList.find(p => query.includes(p.title.toLowerCase()) || query.includes(p.description.toLowerCase()));
      if (matchedProj) {
        return respond(`**${matchedProj.title}**: ${matchedProj.description}\n\n• **Tech Stack:** ${Array.isArray(matchedProj.tech) ? matchedProj.tech.join(", ") : matchedProj.tech}.`);
      }
    }

    // 7. BROAD CATEGORY QUERY MATCHING
    if (hasWord("qualification", "qualifications", "education background")) {
      return respond(`Merlin holds a **${eduList[0]?.degree || "B.E./B.Tech in CSE"}** from ${eduList[0]?.institution || "AVIT Chennai"} (${eduList[0]?.year || "2019-2023"}), along with certifications in ${certList.join(", ")} 🎓.`);
    }

    if (hasWord("experience", "work experience", "background")) {
      return respond(`Merlin has 1+ year of professional experience. He currently works as a **${expList[0]?.title || "Software Developer"}** at **${expList[0]?.company || "Wyzmindz Solutions"}** (${expList[0]?.year || "2025–Present"}) 💼.`);
    }

    if (hasWord("skills", "tech stack", "technologies")) {
      const grouped = Array.isArray(skillsData)
        ? skillsData.map(c => `• **${c.category}:** ${c.items ? c.items.join(", ") : ""}`).join("\n")
        : skillsList.join(", ");
      return respond(`Here is Merlin's technical skill breakdown ⚡:\n\n${grouped}`);
    }

    if (hasWord("projects", "apps", "bots")) {
      const projs = projList.map(p => `• **${p.title}** (${p.badge})`).join("\n");
      return respond(`Merlin has built several key projects 🚀:\n\n${projs}`);
    }

    if (hasWord("available", "hire", "job", "full time", "joining", "open for")) {
      return respond(`Yes! Merlin is actively open for full-time **Software Developer, AI/ML, and Full-Stack** roles in **${profileData.location}** 🎯.`);
    }

    // 8. DYNAMIC FUZZY TEXT SEARCH FALLBACK IN PORTFOLIO MASTER JSON
    if (query.length > 3) {
      const stopWords = new Set(["merlin", "stuwart", "have", "has", "does", "did", "with", "from", "what", "which", "that", "this", "about", "tell", "show", "know", "knows", "any", "some", "like"]);
      const words = query.split(" ").map(w => w.replace(/[^a-z0-9]/g, "")).filter(w => w.length > 3 && !stopWords.has(w));
      if (words.length > 0) {
        const matchProj = projList.find(p => words.some(w => JSON.stringify(p).toLowerCase().includes(w)));
        if (matchProj) {
          return respond(`Regarding your query about **${matchProj.title}**:\n${matchProj.description}\nKey Tech: ${Array.isArray(matchProj.tech) ? matchProj.tech.join(", ") : matchProj.tech}.`);
        }
      }
    }

    // Conversational Default
    return respond(`As Merlin's Personal Assistant, I can tell you that Merlin is a **${profileData.role || "Software Developer"}** skilled in **${skillsList.slice(0, 5).join(", ")}**.\n\nAsk me about his **college**, **company**, **skills**, **projects**, or **contact info** for specific details!`);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const text = inputMsg;
    setInputMsg("");
    addUserMessage(text);
    generateAiResponse(text);
  };

  const copyHiringManagerPitch = () => {
    const pitchText = `Candidate Evaluation Note for ${selectedRole.role}:
Name: ${profileData.name}
Match Score: ${selectedRole.matchScore}%
Location: ${profileData.location}
Contact: ${profileData.email} | ${profileData.phone}
Skills: ${selectedRole.matchedSkills.join(', ')}

Key Highlights:
- ${selectedRole.reasons.join('\n- ')}

Featured Project: ${selectedRole.keyProject}`;

    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        className="copilot-floating-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Ask Recruiter Copilot"
        title="Recruiter AI Copilot"
      >
        <span className="copilot-icon-pulse"><FiCpu /></span>
        <div className="copilot-btn-content">
          <span>Recruiter AI Copilot</span>
          <span className="copilot-badge">Precision PA</span>
        </div>
      </button>

      {/* Modal Drawer */}
      {isOpen && (
        <div className="copilot-overlay" onClick={() => setIsOpen(false)}>
          <div className="copilot-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="copilot-header">
              <div className="copilot-header-info">
                <div className="copilot-avatar">
                  <FiCpu />
                </div>
                <div>
                  <h3 className="copilot-title">Alex (Merlin's Personal Assistant) <FiUserCheck style={{ color: '#22c55e' }} /></h3>
                  <p className="copilot-subtitle">Universal Precision Search Assistant</p>
                </div>
              </div>
              <button className="copilot-close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="copilot-tabs">
              <button
                className={`copilot-tab ${activeTab === "chat" ? "active" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                <FiMessageSquare /> Ask Alex (PA Q&A)
              </button>
              <button
                className={`copilot-tab ${activeTab === "evaluator" ? "active" : ""}`}
                onClick={() => setActiveTab("evaluator")}
              >
                <FiTarget /> Role Match Fit
              </button>
            </div>

            {/* Tab 1: Chat Q&A */}
            {activeTab === "chat" && (
              <>
                <div className="copilot-body">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`copilot-msg ${msg.sender}`}>
                      <div className="copilot-msg-bubble">
                        {msg.text.split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="copilot-msg-time">{msg.time}</span>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="copilot-msg assistant">
                      <div className="copilot-msg-bubble" style={{ opacity: 0.7, fontStyle: "italic" }}>
                        Alex is thinking... 🤖
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Suggested Questions Drawer Popover (Shown only when toggled) */}
                {showSuggestions && (
                  <div className="suggestions-popover">
                    <div className="suggestions-popover-header">
                      <span>💡 Suggested Questions for Recruiters</span>
                      <button className="suggestions-close-btn" onClick={() => setShowSuggestions(false)}>
                        <FiX />
                      </button>
                    </div>
                    <div className="copilot-presets">
                      {PRESET_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          className="copilot-preset-chip"
                          onClick={() => handleQuestionSelect(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Input & Suggestions Bar */}
                <div className="copilot-footer-container">
                  <div className="copilot-suggestion-bar">
                    <button
                      type="button"
                      className={`suggest-toggle-btn ${showSuggestions ? "active" : ""}`}
                      onClick={() => setShowSuggestions(!showSuggestions)}
                    >
                      💡 Suggested Questions
                    </button>
                  </div>
                  <form className="copilot-footer" onSubmit={handleSend}>
                    <input
                      type="text"
                      className="copilot-input"
                      placeholder="Ask Alex anything about Merlin..."
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                    />
                    <button type="submit" className="copilot-send-btn" aria-label="Send">
                      <FiSend />
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* Tab 2: Role Match Evaluator */}
            {activeTab === "evaluator" && (
              <div className="copilot-body">
                <div className="role-evaluator">
                  <div className="role-selector-group">
                    <span className="role-selector-label">Select Target Opening:</span>
                    <div className="role-options">
                      {dynamicRolesEvaluation.map((r, idx) => (
                        <button
                          key={idx}
                          className={`role-opt-btn ${selectedRole?.role === r.role ? "active" : ""}`}
                          onClick={() => setSelectedRole(r)}
                        >
                          {r.role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Score Card */}
                  {selectedRole && (
                    <div className="match-score-card">
                      <div className="score-header">
                        <div>
                          <h4 style={{ margin: 0, color: "#f8fafc", fontSize: "1rem" }}>{selectedRole.role}</h4>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Candidate Alignment Rating</span>
                        </div>
                        <div className="score-number">{selectedRole.matchScore}%</div>
                      </div>

                      <div className="score-bar-bg">
                        <div className="score-bar-fill" style={{ width: `${selectedRole.matchScore}%` }} />
                      </div>

                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Why {profileData.name} is a fit:</span>
                        <ul style={{ margin: "6px 0 0", paddingLeft: "18px", color: "#e2e8f0", fontSize: "0.82rem", lineHeight: 1.5 }}>
                          {selectedRole.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: "6px" }}>Matched Active Skills:</span>
                        <div className="matched-skills-list">
                          {selectedRole.matchedSkills.map((s, i) => (
                            <span key={i} className="skill-tag">{s}</span>
                          ))}
                        </div>
                      </div>

                      <button className="copy-summary-btn" onClick={copyHiringManagerPitch}>
                        {copied ? <FiCheckCircle /> : <FiCopy />}
                        <span>{copied ? "Copied to Clipboard!" : "Copy Note for Hiring Manager"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Action Footer Links */}
            <div className="quick-actions">
              <a href={profileData.resumeUrl || "/Merlin_Stuwart_Resume.pdf"} download className="action-chip" target="_blank" rel="noreferrer">
                <FiFileText /> Resume PDF
              </a>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profileData.email)}`}
                className="action-chip"
                target="_blank"
                rel="noreferrer"
              >
                <FiMail /> Contact Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
