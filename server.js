require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong" });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({
      status: 200,
      response: responseText,
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      status: 500,
      error: "Gagal memproses permintaan ke AI",
      message: error.message,
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${port}`);
});

module.exports = app;
