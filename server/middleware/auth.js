import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // format: "Bearer tokennya"

  if (!token) return res.status(401).json({ message: "Tidak ada token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // simpan userId ke request
    next();
  } catch {
    res.status(401).json({ message: "Token tidak valid" });
  }
}
