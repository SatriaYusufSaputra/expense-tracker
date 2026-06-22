import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    icon: { type: String, default: "💰" },
    color: { type: String, default: "#166534" },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Wallet", walletSchema);
