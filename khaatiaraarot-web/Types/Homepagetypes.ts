import { StaticImageData } from "next/image";

export type HomePageCategory = {
  label: string;
  bangla: string;
  slug: string;
  image: string | StaticImageData;
  border: string;
  count: number;
};

// export type Product = {
//   id: string;
//   name: string;
//   unit: string;
//   price: number;
//   originalPrice?: number;
//   image: string | StaticImageData;
//   source: string;
//   isBestSelling?: boolean;
//   slug?: string;
//   stockQty?: number;
// };