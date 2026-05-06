import express from "express";
import { upload } from "../utils/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Tidak ada file" });
  res.json({ url: req.file.path }); // Cloudinary return URL di req.file.path
});

export default router;
