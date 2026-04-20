import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import fs from "fs";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("FILE:", req.file);

    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      {
        base64Image: `data:${req.file.mimetype};base64,${base64Image}`,
        language: "eng",
      },
      {
        headers: {
          apikey: "K87088143788957",
        },
      },
    );

    console.log("OCR RESULT:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send("Error OCR");
  }
});

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
