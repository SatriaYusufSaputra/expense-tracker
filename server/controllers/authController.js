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

// GET profil user yang sedang login
export async function getProfile(req, res) {
  const user = await User.findById(req.userId).select("-password"); // jangan kirim password
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  res.json(user);
}

// PUT update nama & email
export async function updateProfile(req, res) {
  const { name, email } = req.body;

  // Cek kalau email sudah dipakai user lain
  const exists = await User.findOne({ email, _id: { $ne: req.userId } });
  if (exists) return res.status(400).json({ message: "Email sudah digunakan" });

  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, email },
    { new: true },
  ).select("-password");

  res.json(user);
}

// POST verifikasi password sebelum update profil
export async function verifyPassword(req, res) {
  const { password } = req.body;

  const user = await User.findById(req.userId);
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ message: "Password salah" });
  res.json({ message: "Password verified" });
}

// PUT ganti password
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId);
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ message: "Password lama salah" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password berhasil diubah" });
}
