import { Request, Response, NextFunction } from "express";
import { env } from "../constants/env";
import jwt from "jsonwebtoken";

const JWT_SECRET = env.JWT_SECRET || "your_jwt_secret_here";

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      username: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
