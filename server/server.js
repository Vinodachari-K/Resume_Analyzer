// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const multer = require("multer");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");

// require("dotenv").config();

// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const app = express();

// app.use(cors());
// app.use(express.json());

// // 📌 Multer Setup (File Upload)
// const upload = multer({ dest: "uploads/" });

// // 📤 Upload & Parse Resume
// app.post("/upload", upload.single("resume"), async (req, res) => {
//   try {
//     const dataBuffer = fs.readFileSync(req.file.path);
//     const pdfData = await pdfParse(dataBuffer);

//     const resumeText = pdfData.text.substring(0, 3000);

//     const response = await openai.responses.create({
//       model: "gpt-4o-mini",
//       input: `
// Analyze this resume and return in JSON format:
// {
//   "score": number,
//   "skills": [],
//   "missing_skills": [],
//   "suggestions": []
// }

// Resume:
// ${resumeText}
//       `,
//     });
  
//     res.json({
//       message: "Analysis complete",
//       result: response.output_text,
//     });

//   } catch (error) {
//     console.error("FULL ERROR 👉", error);
//     res.status(500).json({
//       error: "AI processing failed",
//       details: error.message,
//     });
//   }
// });
// // Test route
// app.get("/", (req, res) => {
//   res.send("Server running...");
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// ***** ==>  FOR MANUAL RESULT <==*****

// 🔹 IMPORTS
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

// 🔹 APP INIT
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 FILE UPLOAD SETUP
const upload = multer({ dest: "uploads/" });

// 📤 UPLOAD ROUTE
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // ✅ Check file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text.toLowerCase();

    // 🔥 SIMPLE SMART ANALYSIS (Manual AI-like logic)

    let score = 50;
    let skills = [];
    let missing_skills = [];
    let suggestions = [];

    // 🎯 Skill detection
    if (resumeText.includes("html")) {
      skills.push("HTML");
      score += 5;
    } else {
      missing_skills.push("HTML");
    }

    if (resumeText.includes("css")) {
      skills.push("CSS");
      score += 5;
    } else {
      missing_skills.push("CSS");
    }

    if (resumeText.includes("javascript")) {
      skills.push("JavaScript");
      score += 10;
    } else {
      missing_skills.push("JavaScript");
    }

    if (resumeText.includes("react")) {
      skills.push("React");
      score += 10;
    } else {
      missing_skills.push("React");
    }

    if (resumeText.includes("node")) {
      skills.push("Node.js");
      score += 10;
    } else {
      missing_skills.push("Node.js");
    }

    if (resumeText.includes("mongodb")) {
      skills.push("MongoDB");
      score += 10;
    } else {
      missing_skills.push("MongoDB");
    }

    // 🎯 Suggestions
    if (score < 70) {
      suggestions.push("Improve technical skills");
    }
    if (!resumeText.includes("project")) {
      suggestions.push("Add project experience");
    }
    if (!resumeText.includes("experience")) {
      suggestions.push("Add work experience section");
    }

    // 🎯 Limit score
    if (score > 100) score = 100;

    // ✅ RESPONSE
    res.json({
      message: "Analysis complete",
      result: {
        score,
        skills,
        missing_skills,
        suggestions,
      },
    });

  } catch (error) {
    console.error("ERROR 👉", error);
    res.status(500).json({
      error: "Processing failed",
      details: error.message,
    });
  }
});

// 🔹 TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running...");
});

// 🔹 SERVER START
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WHAT THIS DOES

// 👉 When you upload resume:

// ✔ Reads PDF
// ✔ Extracts text
// ✔ Checks skills like:

// HTML
// CSS
// JavaScript
// React
// Node.js
// MongoDB

// ✔ Calculates score
// ✔ Gives suggestions