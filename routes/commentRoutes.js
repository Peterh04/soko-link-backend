import {
  comment,
  getVendorComments,
} from "../controllers/commentController.js";
import verifyToken from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/", verifyToken, comment);
router.get("/:vendorId", getVendorComments);

export default router;
