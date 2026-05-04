import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export async function register(req, res) {
  const { name, email, password } = req.body;

  // Cek email sudah terdaftar belum
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email sudah terdaftar" });

  // Hash password sebelum disimpan
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ token: generateToken(user._id) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Email tidak ditemukan" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Password salah" });

  res.json({ token: generateToken(user._id), name: user.name });
}
