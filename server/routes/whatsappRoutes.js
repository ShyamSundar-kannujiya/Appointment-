import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  connectWhatsApp,
  whatsappCallback,
} from "../controllers/whatsappController.js";


const router = express.Router();

router.get("/connect", protect, connectWhatsApp);

router.get("/callback", whatsappCallback);

export default router;
