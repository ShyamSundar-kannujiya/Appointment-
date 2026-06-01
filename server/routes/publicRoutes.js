import express from "express";

import {
  getShopBySlug,
  getServicesBySlug,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/shops/:slug", getShopBySlug);

router.get("/shops/:slug/services", getServicesBySlug);

export default router;
