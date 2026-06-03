import express from "express";

import {
  createBooking,
  getBookings,
  updateBookingStatus,
  submitPaymentProof,
  updatePaymentStatus,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public */

router.post("/", createBooking);

/* Owner */

router.get("/", protect, getBookings);

router.put("/:id/status", protect, updateBookingStatus);

router.post("/payment-proof", submitPaymentProof);

router.put("/:id/payment-status", protect, updatePaymentStatus);

export default router;
