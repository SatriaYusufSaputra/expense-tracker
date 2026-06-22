import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MANGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
