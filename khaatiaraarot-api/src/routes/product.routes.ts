import { Router } from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  getTopSellers,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/top-sellers", getTopSellers);
router.get("/:id", getProductById);

export default router;
