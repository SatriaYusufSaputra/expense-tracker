import mongoose from "mongoose";

const payLaterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:   { type: String, required: true },
  icon:   { type: String, default: "💳" },
  color:  { type: String, default: "#ef4444" },
  limit:  { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("PayLater", payLaterSchema);