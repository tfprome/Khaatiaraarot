import { Request, Response } from "express";

export async function getOrders(req: Request, res: Response) {
  res.json({ data: [] });
}

export async function createOrder(req: Request, res: Response) {
  res.status(201).json({ data: null });
}

export async function getOrderById(req: Request, res: Response) {
  res.json({ data: null });
}
