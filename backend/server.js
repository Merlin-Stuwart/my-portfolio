import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Public folder directory (frontend/public — served by Vite)
const publicDir = path.join(__dirname, "../frontend/public");
const configPath = path.join(__dirname, "adminConfig.json");

app.use(express.static(publicDir));

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
// Helper to load .env file variables
const loadEnvVars = () => {
  const envPath = path.join(__dirname, ".env");
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...vals] = trimmed.split("=");
        if (key) {
          envVars[key.trim()] = vals.join("=").trim();
        }
      }
    }
  }
  return envVars;
};
// Helper to get admin PIN from JSON file
const getAdminPin = () => {
  const envVars = loadEnvVars();
  const adminPin = process.env.ADMIN_PIN || envVars.ADMIN_PIN;

  if (adminPin) {
    return adminPin;
  }

  if (fs.existsSync(configPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return data.adminPin || null;
    } catch (e) {
      return null;
    }
  }

  return null;
};

// Helper to save admin PIN
const saveAdminPin = (newPin) => {
  fs.writeFileSync(configPath, JSON.stringify({ adminPin: newPin }, null, 2), "utf-8");
};

// Multer Storage to overwrite profile1.png, profile2.png, and resume PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicDir);
  },
  filename: (req, file, cb) => {
    const fieldname = req.query.targetField || req.body?.targetField || file.fieldname;
    if (fieldname === "avatar1" || fieldname === "profile1") {
      cb(null, "profile1.png");
    } else if (fieldname === "avatar2" || fieldname === "profile2") {
      cb(null, "profile2.png");
    } else if (fieldname === "resume" || fieldname === "resumeUrl") {
      cb(null, "Merlin_Stuwart_Resume.pdf");
    } else {
      cb(null, "profile1.png");
    }
  },
});

const upload = multer({ storage });

// POST endpoint for file upload (avatars)
app.post("/api/upload-avatar", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const field = req.query.targetField || req.body?.targetField || req.file.fieldname;
  const fileName = (field === "avatar2" || field === "profile2") ? "profile2.png" : "profile1.png";
  const fileUrl = `/${fileName}?v=${Date.now()}`;

  console.log(`Successfully updated ${fileName} in public folder.`);
  return res.json({
    success: true,
    fileUrl,
    message: `File ${fileName} replaced in public folder!`,
  });
});

// POST endpoint for resume file upload (PDF/DOC/DOCX)
app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No resume file uploaded" });
  }

  const fileName = "Merlin_Stuwart_Resume.pdf";
  const fileUrl = `/${fileName}?v=${Date.now()}`;
  console.log(`Successfully updated ${fileName} in public folder.`);

  // Auto-update resumeUrl in portfolioData.json if it exists
  const portfolioDataPath = path.join(__dirname, "portfolioData.json");
  if (fs.existsSync(portfolioDataPath)) {
    try {
      const currentData = JSON.parse(fs.readFileSync(portfolioDataPath, "utf-8"));
      if (currentData.profile) {
        currentData.profile.resumeUrl = fileUrl;
        fs.writeFileSync(portfolioDataPath, JSON.stringify(currentData, null, 2), "utf-8");
        console.log("Updated resumeUrl in portfolioData.json");
      }
    } catch (e) {
      console.warn("Could not auto-update portfolioData.json with resumeUrl:", e);
    }
  }

  return res.json({
    success: true,
    fileUrl,
    message: `Resume file permanently replaced in public folder!`,
  });
});

// ==========================================
// CONTACT INQUIRIES & CHUNKED LOG ROTATION
// ==========================================
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const MAX_MESSAGES_PER_FILE = 50;

if (!fs.existsSync(MESSAGES_FILE)) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), "utf-8");
  } catch (e) {}
}

const getMessages = () => {
  if (!fs.existsSync(MESSAGES_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
  } catch (e) {
    console.error("Error reading messages.json:", e);
    return [];
  }
};

const getArchivesList = () => {
  try {
    const files = fs.readdirSync(__dirname);
    return files
      .filter((f) => /^messages_\d+\.json$/.test(f))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0], 10);
        const numB = parseInt(b.match(/\d+/)[0], 10);
        return numA - numB;
      });
  } catch (e) {
    return [];
  }
};

const saveMessageWithRotation = (newMessage) => {
  let messages = getMessages();
  messages.unshift(newMessage); // Latest inquiries on top

  // Auto-rotate when limit is reached
  if (messages.length > MAX_MESSAGES_PER_FILE) {
    let archiveIndex = 1;
    while (fs.existsSync(path.join(__dirname, `messages_${archiveIndex}.json`))) {
      archiveIndex++;
    }
    const olderMessages = messages.slice(MAX_MESSAGES_PER_FILE);
    fs.writeFileSync(
      path.join(__dirname, `messages_${archiveIndex}.json`),
      JSON.stringify(olderMessages, null, 2),
      "utf-8"
    );
    console.log(`Rotated ${olderMessages.length} older messages into messages_${archiveIndex}.json`);

    // Keep active file under MAX_MESSAGES_PER_FILE
    messages = messages.slice(0, MAX_MESSAGES_PER_FILE);
  }

  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
  return messages;
};

// POST: Save new visitor contact inquiry
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });
  }

  const newEntry = {
    id: "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    timestamp: new Date().toISOString(),
    dateStr: new Date().toLocaleString(),
    isRead: false,
  };

  try {
    saveMessageWithRotation(newEntry);
    console.log(`Saved new contact inquiry from ${newEntry.name} (${newEntry.email})`);
    return res.json({
      success: true,
      message: "Inquiry saved successfully in portfolio database!",
      entry: newEntry,
    });
  } catch (err) {
    console.error("Failed to save contact message:", err);
    return res.status(500).json({ success: false, message: "Could not save message to database." });
  }
});

// GET: Fetch all active inquiries (for Admin Mode)
app.get("/api/admin/messages", (req, res) => {
  const messages = getMessages();
  const archives = getArchivesList();
  return res.json({
    success: true,
    count: messages.length,
    maxPerFile: MAX_MESSAGES_PER_FILE,
    messages,
    archives,
  });
});

// DELETE: Delete a specific message by ID
app.delete("/api/admin/messages/:id", (req, res) => {
  const { id } = req.params;
  let messages = getMessages();
  const filtered = messages.filter((m) => m.id !== id);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return res.json({ success: true, message: "Message deleted successfully." });
});

// POST endpoint to verify admin PIN
app.post("/api/admin/verify-pin", (req, res) => {
  const { pin } = req.body;
  const currentPin = getAdminPin();
  console.log("Admin PIN loaded:", Boolean(currentPin));
  console.log("Stored PIN length:", currentPin?.length);
  console.log("Entered PIN length:", String(pin || "").length);
  if (pin === currentPin) {
    return res.json({ success: true, message: "Authentication successful" });
  }
  return res.status(401).json({ success: false, message: "Incorrect Access Key" });
});

// POST endpoint to change admin PIN
app.post("/api/admin/change-pin", (req, res) => {
  const { currentPin, newPin } = req.body;

  const savedPin = getAdminPin();

  if (!savedPin || currentPin !== savedPin) {
    return res.status(401).json({
      success: false,
      message: "Current PIN is incorrect"
    });
  }

  if (!newPin || newPin.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New PIN must be at least 8 characters"
    });
  }

  saveAdminPin(newPin);

  return res.json({
    success: true,
    message: "Passcode updated successfully"
  });
});

const portfolioDataPath = path.join(__dirname, "portfolioData.json");

// GET endpoint to fetch server-side portfolio JSON
app.get("/api/portfolio-data", (req, res) => {
  if (fs.existsSync(portfolioDataPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(portfolioDataPath, "utf-8"));
      return res.json({ success: true, data });
    } catch (e) {
      console.error("Error reading portfolioData.json:", e);
      return res.status(500).json({ success: false, message: "Error reading JSON file" });
    }
  }
  return res.status(404).json({ success: false, message: "portfolioData.json not found" });
});

// POST endpoint to update and save server-side portfolio JSON
app.post("/api/portfolio-data", (req, res) => {
  try {
    const updatedData = req.body;
    fs.writeFileSync(portfolioDataPath, JSON.stringify(updatedData, null, 2), "utf-8");
    console.log("Successfully saved updated portfolioData.json on server.");
    return res.json({ success: true, message: "Portfolio JSON updated permanently on server!" });
  } catch (e) {
    console.error("Error writing portfolioData.json:", e);
    return res.status(500).json({ success: false, message: "Failed to update JSON file on server" });
  }
});



// POST endpoint for Free AI Copilot Chat (Gemini / Groq / Pollinations AI / Fallback RAG)
app.post("/api/copilot/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const envVars = loadEnvVars();
    const geminiKey = process.env.GEMINI_API_KEY || envVars.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || envVars.GROQ_API_KEY;

    let masterData = {};
    if (fs.existsSync(portfolioDataPath)) {
      try {
        masterData = JSON.parse(fs.readFileSync(portfolioDataPath, "utf-8"));
      } catch (e) {
        console.error("Error reading portfolio JSON for AI context:", e);
      }
    }

    const systemPrompt = `You are Alex, Merlin Stuwart's Personal Executive Assistant 🤖.
Your role is to answer questions from recruiters, hiring managers, and portfolio visitors warmly, professionally, and concisely in human conversational sentences.
Always refer to Merlin in the third person ("Merlin is...", "He built...").

Here is Merlin Stuwart's complete master portfolio data:
${JSON.stringify(masterData, null, 2)}

Instructions:
1. Answer the question accurately using ONLY the portfolio data provided above.
2. Keep responses brief (1-3 sentences or short bullet points), warm, and engaging.
3. If asked about a skill, college, company, contact info, or project, provide exact details.
4. Do not invent details not present in the master portfolio data.`;

    // Strategy 1: Google Gemini 1.5 Flash Free API
    if (geminiKey) {
      try {
        console.log("Generating response via Google Gemini Free API...");
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
                }
              ]
            })
          }
        );
        const gData = await geminiRes.json();
        if (gData.candidates && gData.candidates[0]?.content?.parts[0]?.text) {
          const aiReply = gData.candidates[0].content.parts[0].text;
          return res.json({ success: true, response: aiReply, provider: "Google Gemini 1.5 Flash (Free)" });
        }
      } catch (gemErr) {
        console.error("Gemini API call failed, trying next provider:", gemErr);
      }
    }

    // Strategy 2: Groq Llama 3 Free API
    if (groqKey) {
      try {
        console.log("Generating response via Groq Llama 3 Free API...");
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ]
          })
        });
        const qData = await groqRes.json();
        if (qData.choices && qData.choices[0]?.message?.content) {
          return res.json({ success: true, response: qData.choices[0].message.content, provider: "Groq Llama 3.3 (Free)" });
        }
      } catch (groqErr) {
        console.error("Groq API call failed, trying next provider:", groqErr);
      }
    }

    // Strategy 3: Free Open Pollinations AI LLM Endpoint (Zero API Key required!)
    try {
      console.log("Generating response via Free Pollinations Open AI Model...");
      const polRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          model: "openai",
          seed: 42
        })
      });

      if (polRes.ok) {
        const polText = await polRes.text();
        const isBadResponse =
          !polText ||
          polText.length < 5 ||
          polText.includes("Free limit reached") ||
          polText.includes("Please wait") ||
          polText.includes("pollinations.ai") ||
          polText.includes("pollen key") ||
          polText.includes("rate limit") ||
          polText.includes("Error") ||
          polText.includes("error") ||
          polText.includes("PAYMENT_REQUIRED");

        if (!isBadResponse) {
          return res.json({ success: true, response: polText.trim(), provider: "Free Open Pollinations AI" });
        }
        console.warn("Pollinations AI returned rate limit/warning, falling back to local RAG engine.");
      }
    } catch (polErr) {
      console.error("Pollinations AI call failed:", polErr);
    }

    // Strategy 4: Graceful fallback so client uses precision local RAG engine
    return res.json({ success: false, fallback: true });

  } catch (err) {
    console.error("Error in /api/copilot/chat:", err);
    return res.json({ success: false, fallback: true });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
