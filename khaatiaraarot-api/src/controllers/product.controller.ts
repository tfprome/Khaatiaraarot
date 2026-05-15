import { Request, Response } from "express";

export async function getProducts(req: Request, res: Response) {
  res.json({ data: [] });
}

export async function getProductById(req: Request, res: Response) {
  res.json({ data: null });
}

export async function getCategories(req: Request, res: Response) {
  res.json({ data: [] });
}

export async function getTopSellers(req: Request, res: Response) {
  res.json({ data: [] });
}
