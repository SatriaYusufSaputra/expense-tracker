import PayLater from "../models/PayLater.js";
import PayLaterItem from "../models/PayLaterItem.js";
import Wallet from "../models/Wallet.js";

// ── PayLater Accounts ──────────────────────

export async function getPayLaters(req, res) {
  try {
    const payLaters = await PayLater.find({ userId: req.userId }).sort({
      createdAt: 1,
    });

    const result = await Promise.all(
      payLaters.map(async (payLater) => {
        const items = await PayLaterItem.find({
          userId: req.userId,
          payLaterId: payLater._id,
          isPaid: false,
        }).sort({ dueDate: 1 });

        const totalTagihan = items.reduce(
          (acc, item) => acc + Number(item.amount || 0),
          0,
        );

        const nearestDue = items[0]?.dueDate || null;

        return {
          ...payLater.toObject(),
          totalTagihan,
          itemCount: items.length,
          nearestDue,
        };
      }),
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data paylater" });
  }
}

export async function createPayLater(req, res) {
  try {
    const { name, icon, color, limit } = req.body;

    const payLater = await PayLater.create({
      userId: req.userId,
      name,
      icon: icon || "💳",
      color: color || "#ef4444",
      limit: Number(limit || 0),
    });

    res.status(201).json(payLater);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat paylater" });
  }
}

export async function updatePayLater(req, res) {
  try {
    const payLater = await PayLater.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      req.body,
      { new: true },
    );

    if (!payLater) {
      return res.status(404).json({ message: "PayLater tidak ditemukan" });
    }

    res.json(payLater);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengubah paylater" });
  }
}

export async function deletePayLater(req, res) {
  try {
    const payLater = await PayLater.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!payLater) {
      return res.status(404).json({ message: "PayLater tidak ditemukan" });
    }

    await PayLaterItem.deleteMany({
      userId: req.userId,
      payLaterId: req.params.id,
    });

    res.json({ message: "PayLater dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus paylater" });
  }
}

// ── PayLater Items ──────────────────────

export async function getPayLaterItems(req, res) {
  try {
    const items = await PayLaterItem.find({
      userId: req.userId,
      payLaterId: req.params.payLaterId,
    }).sort({ dueDate: 1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil tagihan" });
  }
}

export async function createPayLaterItem(req, res) {
  try {
    const { name, amount, dueDate } = req.body;

    const payLater = await PayLater.findOne({
      _id: req.params.payLaterId,
      userId: req.userId,
    });

    if (!payLater) {
      return res.status(404).json({ message: "PayLater tidak ditemukan" });
    }

    const item = await PayLaterItem.create({
      userId: req.userId,
      payLaterId: req.params.payLaterId,
      name,
      amount: Number(amount || 0),
      dueDate,
      isPaid: false,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat tagihan" });
  }
}

export async function markAsPaid(req, res) {
  try {
    const { walletId } = req.body;
    const itemId = req.params.itemId || req.params.id;

    const item = await PayLaterItem.findOne({
      _id: itemId,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    if (item.isPaid) {
      return res.status(400).json({ message: "Tagihan sudah lunas" });
    }

    if (walletId) {
      const wallet = await Wallet.findOne({
        _id: walletId,
        userId: req.userId,
      });

      if (!wallet) {
        return res.status(404).json({ message: "Wallet tidak ditemukan" });
      }

      if (Number(wallet.balance) < Number(item.amount)) {
        return res.status(400).json({
          message: `Saldo ${wallet.name} tidak cukup`,
        });
      }

      await Wallet.findOneAndUpdate(
        {
          _id: walletId,
          userId: req.userId,
        },
        {
          $inc: { balance: -Number(item.amount) },
        },
      );
    }

    const updated = await PayLaterItem.findOneAndUpdate(
      {
        _id: itemId,
        userId: req.userId,
      },
      {
        isPaid: true,
        paidAt: new Date(),
        walletId: walletId || null,
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memproses pembayaran" });
  }
}

export async function deletePayLaterItem(req, res) {
  try {
    const itemId = req.params.itemId || req.params.id;

    const item = await PayLaterItem.findOneAndDelete({
      _id: itemId,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    res.json({ message: "Tagihan dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus tagihan" });
  }
}
