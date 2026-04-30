
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import expenseRoutes from "./routes/expenses.js";


dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // URL React kamu
app.use(express.json());

app.use("/api/expenses", expenseRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
