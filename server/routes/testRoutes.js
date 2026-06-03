import express from "express";
import { sendWhatsAppMessage } from "../utils/sendWhatsApp.js";

const router = express.Router();

router.get("/test-whatsapp", async (req, res) => {
  await sendWhatsAppMessage(
    "+917347725364",
    "Shyam",
    "Test Service",
    "2026-06-01",
    "04:00 PM",
  );

  res.json({
    success: true,
    message: "WhatsApp Test Sent",
  });
});

export default router;
