import verifyToken from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} from "../controllers/userWishlistController.js";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, getUserWishlist);
router.post("/add", verifyToken, addToWishlist);
router.delete("/remove", verifyToken, removeFromWishlist);

export default router;
