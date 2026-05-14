import { StaticImageData } from "next/image";
import type { ImageProps } from "next/image";

export type Category = {
  label: string;
  bangla: string;
  slug: string;
  image: string | StaticImageData;
  border: string;
  count: number;
};

export type Product = {
  id: number;
  name: string;
  unit: string;
  price: number;
  originalPrice?: number;
  image: ImageProps["src"];
  source: string;
  isBestSelling?: boolean;
};