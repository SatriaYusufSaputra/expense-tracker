import mongoose from "mongoose";

const payLaterItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payLaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayLater",
      required: true,
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
    }, // ✅ tambah ini
  },
  { timestamps: true },
);

export default mongoose.model("PayLaterItem", payLaterItemSchema);
