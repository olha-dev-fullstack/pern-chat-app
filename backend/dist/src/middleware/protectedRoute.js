import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = await prisma.user.findUnique({
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
export default protectedRoute;
