import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  exchangeWhatsAppCode,
  getWhatsAppConfig,
} from "../controllers/whatsappController.js";

const router = express.Router();

router.get("/config", protect, getWhatsAppConfig);
router.post("/exchange-code", protect, exchangeWhatsAppCode);

export default router;
