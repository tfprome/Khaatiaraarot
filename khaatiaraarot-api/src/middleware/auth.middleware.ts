import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // TODO: verify JWT and attach user to req.user
  next();
}
