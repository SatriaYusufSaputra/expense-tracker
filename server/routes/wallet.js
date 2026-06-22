import express from "express";
import {
  getWallets,
  createWallet,
  updateWallet,
  updateBalance,
  deleteWallet,
} from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getWallets);
router.post("/", protect, createWallet);
router.put("/:id", protect, updateWallet);
router.put("/:id/balance", protect, updateBalance);
router.delete("/:id", protect, deleteWallet);

export default router;
