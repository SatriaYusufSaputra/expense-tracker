import Expense from "../models/Expense.js";
import Wallet from "../models/Wallet.js";

// Helper update saldo wallet
async function adjustWalletBalance(walletId, amount, operation) {
  if (!walletId) return;
  const multiplier = operation === "add" ? 1 : -1;
  await Wallet.findByIdAndUpdate(walletId, {
    $inc: { balance: multiplier * amount },
  });
}

export async function getExpenses(req, res) {
  const expenses = await Expense.find({ userId: req.userId }).sort({
    date: -1,
  });
  res.json(expenses);
}

export async function createExpense(req, res) {
  try {
    const { type, amount, walletId, toWalletId } = req.body;

    // Cek saldo cukup untuk pengeluaran/transfer
    if ((type === "expense" || type === "transfer") && walletId) {
      const wallet = await Wallet.findById(walletId);
      if (!wallet)
        return res.status(404).json({ message: "Wallet tidak ditemukan" });
      if (wallet.balance < Number(amount)) {
        return res
          .status(400)
          .json({ message: `Saldo ${wallet.name} tidak cukup` });
      }
    }

    const expense = await Expense.create({ ...req.body, userId: req.userId });

    // Update saldo wallet
    if (type === "income") {
      await adjustWalletBalance(walletId, amount, "add");
    } else if (type === "expense") {
      await adjustWalletBalance(walletId, amount, "subtract");
    } else if (type === "transfer") {
      await adjustWalletBalance(walletId, amount, "subtract"); // wallet asal berkurang
      await adjustWalletBalance(toWalletId, amount, "add"); // wallet tujuan bertambah
    }

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan transaksi" });
  }
}

export async function updateExpense(req, res) {
  try {
    const old = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!old)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    // Reverse saldo lama dulu
    if (old.type === "income") {
      await adjustWalletBalance(old.walletId, old.amount, "subtract");
    } else if (old.type === "expense") {
      await adjustWalletBalance(old.walletId, old.amount, "add");
    } else if (old.type === "transfer") {
      await adjustWalletBalance(old.walletId, old.amount, "add");
      await adjustWalletBalance(old.toWalletId, old.amount, "subtract");
    }

    const { type, amount, walletId, toWalletId } = req.body;

    // Cek saldo cukup untuk data baru
    if ((type === "expense" || type === "transfer") && walletId) {
      const wallet = await Wallet.findById(walletId);
      if (wallet.balance < Number(amount)) {
        // Kembalikan saldo lama karena kita sudah reverse
        if (old.type === "income")
          await adjustWalletBalance(old.walletId, old.amount, "add");
        else if (old.type === "expense")
          await adjustWalletBalance(old.walletId, old.amount, "subtract");
        else if (old.type === "transfer") {
          await adjustWalletBalance(old.walletId, old.amount, "subtract");
          await adjustWalletBalance(old.toWalletId, old.amount, "add");
        }
        return res
          .status(400)
          .json({ message: `Saldo ${wallet.name} tidak cukup` });
      }
    }

    // Apply saldo baru
    if (type === "income") {
      await adjustWalletBalance(walletId, amount, "add");
    } else if (type === "expense") {
      await adjustWalletBalance(walletId, amount, "subtract");
    } else if (type === "transfer") {
      await adjustWalletBalance(walletId, amount, "subtract");
      await adjustWalletBalance(toWalletId, amount, "add");
    }

    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update transaksi" });
  }
}

export async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!expense) return res.status(404).json({ message: "Tidak ditemukan" });

    // Reverse saldo
    if (expense.type === "income") {
      await adjustWalletBalance(expense.walletId, expense.amount, "subtract");
    } else if (expense.type === "expense") {
      await adjustWalletBalance(expense.walletId, expense.amount, "add");
    } else if (expense.type === "transfer") {
      await adjustWalletBalance(expense.walletId, expense.amount, "add");
      await adjustWalletBalance(expense.toWalletId, expense.amount, "subtract");
    }

    await expense.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal hapus transaksi" });
  }
}
