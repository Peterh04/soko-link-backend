import {
  getMessagesByRoom,
  getLatestMessages,
  getReceiverDetails,
} from "../controllers/messagesController.js";
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/receiver", verifyToken, getReceiverDetails);
router.get("/:roomId", verifyToken, getMessagesByRoom);
router.get("/", verifyToken, getLatestMessages);

export default router;
