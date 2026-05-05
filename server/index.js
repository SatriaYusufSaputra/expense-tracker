import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import expenseRoutes from "./routes/expenses.js";
import authRoutes from "./routes/auth.js";
import { protect } from "./middleware/auth.js";

dotenv.config();

const app = express(); // ✅ app harus didefinisikan DULU sebelum app.use()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://expense-tracker-kohl-phi-25.vercel.app",
  ]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", protect, expenseRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});