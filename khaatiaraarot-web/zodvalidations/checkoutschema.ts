import { z } from "zod";

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),

  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number"),

  address: z
    .string()
    .min(5, "Address is required"),

  district: z
    .string()
    .min(2, "District is required"),

  city: z
    .string()
    .min(2, "City is required"),

  billing: z.string().min(5, "Billing address is required"),

  postalCode: z
    .string()
    .min(4, "Postal code is required"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;