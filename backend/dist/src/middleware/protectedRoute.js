"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../db/prisma"));
const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullName: true, profilePic: true },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protected route", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.default = protectedRoute;
