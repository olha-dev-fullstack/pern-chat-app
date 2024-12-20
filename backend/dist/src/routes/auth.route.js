"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const protectedRoute_1 = __importDefault(require("../middleware/protectedRoute"));
const router = express_1.default.Router();
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.post("/signup", auth_controller_1.signup);
router.get("/me", protectedRoute_1.default, auth_controller_1.getMe);
exports.default = router;
