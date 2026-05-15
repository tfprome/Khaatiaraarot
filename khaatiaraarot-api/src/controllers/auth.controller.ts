import { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  // TODO: implement
  res.status(201).json({ message: "register" });
}

export async function login(req: Request, res: Response) {
  // TODO: implement
  res.status(200).json({ message: "login" });
}

export async function logout(req: Request, res: Response) {
  // TODO: implement
  res.status(200).json({ message: "logout" });
}
