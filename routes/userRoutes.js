import {
  updateUser,
  getUser,
  updateUserPassword,
  upgradeUserRole,
} from "../controllers/userControlller.js";

import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();

router.get("/me", verifyToken, getUser);
router.patch("/update", verifyToken, upload.single("profileImage"), updateUser);
router.patch("/update/password", verifyToken, updateUserPassword);
router.patch("/update/role", verifyToken, upgradeUserRole);

export default router;
