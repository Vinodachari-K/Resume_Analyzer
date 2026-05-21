const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");

// ✅ Load .env correctly (IMPORTANT)
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

app.use(cors());
app.use(express.json());

// 📁 Multer setup
const upload = multer({ dest: "uploads/" });

// 📤 Upload route
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // ✅ Check file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 📄 Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text.substring(0, 3000);

    // 🤖 Gemini API Call (FIXED MODEL)

const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        parts: [
          {
            text: `Analyze this resume and return JSON with score, skills, missing_skills, suggestions:\n\n${resumeText}`,
          },
        ],
      },
    ],
  }
);

    // 📦 Extract AI response safely
    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("No response from Gemini API");
    }

    // 🧹 Clean JSON
    const cleaned = aiText.replace(/```json|```/g, "").trim();

    let result;

    try {
      result = JSON.parse(cleaned);
    } catch (e) {
      console.log("JSON parse failed 👉", cleaned);

      result = {
        score: 50,
        skills: [],
        missing_skills: [],
        suggestions: ["AI response parsing failed"],
      };
    }

    // 📤 Send response
    res.json({
      message: "Analysis complete",
      result: result,
    });

  } catch (error) {
    // ✅ FULL ERROR LOG (VERY IMPORTANT)
    console.error("FULL ERROR 👉", error.response?.data || error.message);

    res.status(500).json({
      error: "Something went wrong",
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server running...");
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});