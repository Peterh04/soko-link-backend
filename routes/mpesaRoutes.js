import express from "express";
import {
  getMpesaToken,
  stkPush,
  callback,
} from "../controllers/mpesaController.js";

const router = express.Router();

router.get("/token", getMpesaToken);
router.post("/stkpush", stkPush);
router.post("/callback", callback);

export default router;
