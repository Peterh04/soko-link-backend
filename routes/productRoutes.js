import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  searchProduct,
  getAllVendorProducts,
  getAllPersonalProducts,
} from "../controllers/productController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { verifyIsVendor } from "../middleware/vendorMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/vendor/createProduct",
  verifyToken,
  upload.array("images", 10),
  createProduct
);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.delete(
  "/vendor/deleteProduct",
  verifyToken,
  verifyIsVendor,
  deleteProduct
);

router.get("/vendor/getProducts", verifyToken, getAllPersonalProducts);
router.get("/vendor/:vendorId/getProducts", verifyToken, getAllVendorProducts);

router.get("/search/:searchTerm", searchProduct);

export default router;
