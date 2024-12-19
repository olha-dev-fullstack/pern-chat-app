import express from "express";
import protectedRoute from "../middleware/protectedRoute";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller";

const router = express.Router();

router.get("/conversations", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);

export default router;
