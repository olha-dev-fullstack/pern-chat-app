"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersForSidebar = exports.getMessages = exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const socket_1 = require("../socket/socket");
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = await prisma_1.default.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });
        if (!conversation) {
            conversation = await prisma_1.default.conversation.create({
                data: {
                    participantsIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }
        const newMessage = await prisma_1.default.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = await prisma_1.default.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error in sendMessages", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.sendMessage = sendMessage;
const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma_1.default.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, userToChatId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.log("Error in getMessages", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getMessages = getMessages;
const getUsersForSidebar = async (req, res) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma_1.default.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.log("Error in getConversations", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getUsersForSidebar = getUsersForSidebar;
