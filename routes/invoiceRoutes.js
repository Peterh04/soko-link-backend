import express, { Router } from "express";
import {
  createInvoice,
  getIvoice,
  getUserInvoices,
} from "../controllers/invoiceConntroller.js";
import { verifyIsVendor } from "../middleware/vendorMiddleware.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, verifyIsVendor, createInvoice);
router.get("/:id", verifyToken, getIvoice);
router.get("/", verifyToken, getUserInvoices);

export default router;
