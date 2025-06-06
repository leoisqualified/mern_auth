import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validations/auth.schema";
import { z } from "zod";
import { AuthRequest } from "../middleware/authenticate";
import { env } from "../constants/env";

export const register = async (req: Request, res: Response) => {
  try {
    // This checks the request body and throws if it's invalid
    const { username, password } = registerSchema.parse(req.body);

    // Validation passed — continue
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, username: user.username };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 15, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .status(200)
      .json({ message: "Login successful", user: payload });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = (req: AuthRequest, res: Response) => {
  // req.user is guaranteed to exist if middleware passed
  return res.json({
    message: `Hello ${req.user?.username}`,
    userId: req.user?.id,
  });
};
