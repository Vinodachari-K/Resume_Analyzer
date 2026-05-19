const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 📁 Multer setup
const upload = multer({ dest: "uploads/" });

// 📤 Upload route
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // 📄 Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text.substring(0, 3000);

    // 🤖 Gemini API Call
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
Analyze this resume and return ONLY JSON format:

{
  "score": number (0-100),
  "skills": [],
  "missing_skills": [],
  "suggestions": []
}

Resume:
${resumeText}
                `,
              },
            ],
          },
        ],
      }
    );

    // 📦 Extract AI response
    const aiText =
      response.data.candidates[0].content.parts[0].text;

    // 🧹 Clean JSON (remove ``` if present)
    const cleaned = aiText.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (e) {
      result = { raw: cleaned }; // fallback if parsing fails
    }

    // 📤 Send to frontend
    res.json({
      message: "Analysis complete",
      result: result,
    });

  } catch (error) {
    console.error("ERROR 👉", error.message);

    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
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