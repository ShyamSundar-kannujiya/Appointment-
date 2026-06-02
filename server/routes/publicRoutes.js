import express from "express";

import {
  getShopBySlug,
  getServicesBySlug,
  createPublicBooking,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/shops/:slug", getShopBySlug);

router.get("/shops/:slug/services", getServicesBySlug);

router.post("/bookings", createPublicBooking);

export default router;
