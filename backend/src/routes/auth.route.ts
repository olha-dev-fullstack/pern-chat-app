import express from "express";
import { login, logout, signup } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);

router.get("/logout", logout);

router.get("/signup", signup);

export default router;
