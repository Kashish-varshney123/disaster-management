import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function verifyImageGemini(req, res) {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No image uploaded.' });
  }
  const imgPath = req.file.path;
  let imgBuffer;
  try {
    imgBuffer = fs.readFileSync(imgPath);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to read uploaded image.' });
  }
  const imgBase64 = imgBuffer.toString("base64");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Analyze this image for signs of digital manipulation, deepfake, or authenticity. Give a clear verdict and explain your reasoning.";

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imgBase64,
        },
      },
    ]);
    const text = result.response.text();
    res.json({ status: "success", verdict: "AI Analysis", explanation: text });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Gemini API error: " + err.message });
  } finally {
    fs.unlinkSync(imgPath); // cleanup uploaded file
  }
}
