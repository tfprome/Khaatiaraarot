import { StaticImageData } from "next/image";

export type Category = {
  label: string;
  bangla: string;
  slug: string;
  image: string | StaticImageData;
  border: string;
  count: number;
};