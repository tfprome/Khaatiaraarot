import { StaticImageData } from "next/image";

export type Product = {
  id: string;
  name: string;
  slug: string;
  unit: string;
  sourceRegion: string;
  price: number;
  originalPrice: number | null;
  stockQty: number;
  isBestSelling: boolean;
  categoryId: string;
  createdAt: string;
  image: string | null;
};

export type ProductDetailstype = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  unit: string;
  sourceRegion: string;
  price: number;
  originalPrice: number;
  stockQty: number;
  lowStockThreshold: number;
  isBestSelling: boolean;
  isActive: boolean;
  createdAt: string;
  images: string[];
  category: Category;
}

export type Category = {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  imageUrl?: string | StaticImageData;
  sortOrder: number;
  productCount?: number;
}