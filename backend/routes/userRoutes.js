import express from "express";
import { getOtherUsersList, login, logout, register } from "../controllers/userController.js";
import isAutheticated from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/get-other-users',isAutheticated,getOtherUsersList)

export default router;