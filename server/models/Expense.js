import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // 👈 tambah ini
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Expense", expenseSchema);
