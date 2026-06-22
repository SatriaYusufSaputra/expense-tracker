import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      default: "expense",
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category: { type: String, default: null },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
    },
    toWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
    }, // khusus transfer
    image: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Expense", expenseSchema);
