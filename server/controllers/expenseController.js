import Expense from "../models/Expense.js";

// GET semua expenses
export async function getExpenses(req, res) {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
}

// POST tambah expense baru
export async function createExpense(req, res) {
  const expense = await Expense.create(req.body);
  res.status(201).json(expense);
}

// PUT update expense
export async function updateExpense(req, res) {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }, // return data yang sudah diupdate
  );
  res.json(expense);
}

// DELETE hapus expense
export async function deleteExpense(req, res) {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
