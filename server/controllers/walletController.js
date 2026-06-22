import Wallet from "../models/Wallet.js";

// GET semua wallet milik user
export async function getWallets(req, res) {
  const wallets = await Wallet.find({ userId: req.userId }).sort({
    createdAt: 1,
  });
  res.json(wallets);
}

// POST tambah wallet baru
export async function createWallet(req, res) {
  const { name, icon, color, balance } = req.body;
  const wallet = await Wallet.create({
    userId: req.userId,
    name,
    icon: icon || "💰",
    color: color || "#166534",
    balance: balance || 0,
  });
  res.status(201).json(wallet);
}

// PUT update wallet (nama, icon, color, balance)
export async function updateWallet(req, res) {
  const wallet = await Wallet.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true },
  );
  if (!wallet)
    return res.status(404).json({ message: "Wallet tidak ditemukan" });
  res.json(wallet);
}

// PUT update saldo wallet (tambah/kurang)
export async function updateBalance(req, res) {
  const { amount, operation } = req.body; // operation: "add" | "subtract"
  const wallet = await Wallet.findOne({
    _id: req.params.id,
    userId: req.userId,
  });
  if (!wallet)
    return res.status(404).json({ message: "Wallet tidak ditemukan" });

  if (operation === "add") {
    wallet.balance += Number(amount);
  } else if (operation === "subtract") {
    wallet.balance -= Number(amount);
  }

  await wallet.save();
  res.json(wallet);
}

// DELETE hapus wallet
export async function deleteWallet(req, res) {
  await Wallet.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Wallet dihapus" });
}
