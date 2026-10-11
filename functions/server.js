require("dotenv").config();

const express = require("express");
const {GoogleGenAI} = require("@google/genai");

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY not found");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

app.get("/", (req, res) => {
  res.send("JARVIS backend is running!");
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        error: "Please provide a question.",
      });
    }

    console.log("User:", question);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are JARVIS, a smart college assistant.
Answer clearly and simply.

User: ${question}`,
    });

    const answer = response.text;

    console.log("JARVIS:", answer);

    res.json({
      answer: answer,
    });
  } catch (error) {
    console.error("================================");
    console.error("GEMINI ERROR:");
    console.error(error);
    console.error("================================");

    res.status(500).json({
      error: error.message || "Gemini request failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`JARVIS server running at http://localhost:${PORT}`);
});
