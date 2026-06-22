import express from "express";
import {
  getPayLaters,
  createPayLater,
  updatePayLater,
  deletePayLater,
  getPayLaterItems,
  createPayLaterItem,
  markAsPaid,
  deletePayLaterItem,
} from "../controllers/payLaterController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// PayLater accounts
router.get("/", protect, getPayLaters);
router.post("/", protect, createPayLater);
router.put("/:id", protect, updatePayLater);
router.delete("/:id", protect, deletePayLater);

// PayLater items
router.get("/:payLaterId/items", protect, getPayLaterItems);
router.post("/:payLaterId/items", protect, createPayLaterItem);
router.put("/items/:itemId/paid", protect, markAsPaid);
router.delete("/items/:itemId", protect, deletePayLaterItem);

export default router;
