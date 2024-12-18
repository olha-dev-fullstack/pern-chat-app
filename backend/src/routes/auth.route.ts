import express from "express";
import { login, logout, signup, getMe } from "../controllers/auth.controller";
import protectedRoute from "../middleware/protectedRoute";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/signup", signup);
router.get("/me", protectedRoute, getMe);

export default router;
