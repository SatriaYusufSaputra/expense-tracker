import Expense from "../models/Expense.js";

// GET — hanya ambil expenses milik user ini
export async function getExpenses(req, res) {
  const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
  res.json(expenses);
}

// POST — tambahkan userId saat create
export async function createExpense(req, res) {
  const expense = await Expense.create({ ...req.body, userId: req.userId });
  res.status(201).json(expense);
}

// PUT & DELETE — pastikan hanya bisa edit/hapus milik sendiri
export async function updateExpense(req, res) {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(expense);
}

export async function deleteExpense(req, res) {
  await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
}