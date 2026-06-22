import PayLater from "../models/PayLater.js";
import PayLaterItem from "../models/PayLaterItem.js";

// ── PayLater (akun) ──────────────────────

export async function getPayLaters(req, res) {
  const payLaters = await PayLater.find({ userId: req.userId }).sort({
    createdAt: 1,
  });

  // Hitung total tagihan aktif per paylater
  const result = await Promise.all(
    payLaters.map(async (pl) => {
      const items = await PayLaterItem.find({
        payLaterId: pl._id,
        isPaid: false,
      });
      const totalTagihan = items.reduce((acc, i) => acc + i.amount, 0);
      const nearestDue =
        items.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]?.dueDate ||
        null;
      return {
        ...pl.toObject(),
        totalTagihan,
        itemCount: items.length,
        nearestDue,
      };
    }),
  );

  res.json(result);
}

export async function createPayLater(req, res) {
  const { name, icon, color, limit } = req.body;
  const payLater = await PayLater.create({
    userId: req.userId,
    name,
    icon: icon || "💳",
    color: color || "#ef4444",
    limit: limit || 0,
  });
  res.status(201).json(payLater);
}

export async function updatePayLater(req, res) {
  const payLater = await PayLater.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true },
  );
  res.json(payLater);
}

export async function deletePayLater(req, res) {
  await PayLater.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  await PayLaterItem.deleteMany({ payLaterId: req.params.id }); // hapus semua item juga
  res.json({ message: "PayLater dihapus" });
}

// ── PayLater Items (tagihan) ─────────────

export async function getPayLaterItems(req, res) {
  const items = await PayLaterItem.find({
    payLaterId: req.params.payLaterId,
    userId: req.userId,
  }).sort({ dueDate: 1 });
  res.json(items);
}

export async function createPayLaterItem(req, res) {
  const { name, amount, dueDate } = req.body;
  const item = await PayLaterItem.create({
    userId: req.userId,
    payLaterId: req.params.payLaterId,
    name,
    amount,
    dueDate,
  });
  res.status(201).json(item);
}

export async function markAsPaid(req, res) {
  const item = await PayLaterItem.findOneAndUpdate(
    { _id: req.params.itemId, userId: req.userId },
    { isPaid: true, paidAt: new Date() },
    { new: true },
  );
  res.json(item);
}

export async function deletePayLaterItem(req, res) {
  await PayLaterItem.findOneAndDelete({
    _id: req.params.itemId,
    userId: req.userId,
  });
  res.json({ message: "Item dihapus" });
}
