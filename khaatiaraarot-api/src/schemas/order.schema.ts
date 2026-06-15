import { z } from 'zod';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().min(7, 'Phone number required'),
  line1: z.string().min(3, 'Address line 1 required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  district: z.string().min(2, 'District required'),
  postalCode: z.string().optional(),
});

export const placeOrderSchema = z
  .object({
    addressId: z.string().uuid().optional(),
    address: addressSchema.optional(),
    paymentMethod: z.enum(['cash', 'card', 'gcash', 'bkash', 'nagad']),
    notes: z.string().max(500).optional(),
    couponCode: z.string().min(1).optional(),
  })
  .refine((data) => data.addressId || data.address, {
    message: 'Either addressId or an inline address is required',
  });

export const validateCouponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
});

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(ORDER_STATUSES).optional(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
