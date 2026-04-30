import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: null },
  },
  { timestamps: true }, // otomatis tambah createdAt & updatedAt
);

export default mongoose.model("Expense", expenseSchema);
