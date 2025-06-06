import express from "express";
import { register, login, getProfile } from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";

const authRoutes = express.Router();

// prefix: /auth
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/profile", authenticate, getProfile);

export default authRoutes;
