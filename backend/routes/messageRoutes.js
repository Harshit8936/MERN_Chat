import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import isAutheticated from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post('/send-message/:id',isAutheticated,sendMessage)
router.get('/get-message/:id',isAutheticated,getMessage)

export default router