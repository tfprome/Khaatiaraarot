import { z } from 'zod';
import { BANGLADESH_DISTRICTS } from '../constants/districts';

// ── Rate Plans ────────────────────────────────────────────────────────────────

export const districtRateSchema = z.object({
  district: z.enum(BANGLADESH_DISTRICTS as unknown as [string, ...string[]]),
  costPerUnit: z.number().positive(),
});

export const createRatePlanSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  rates: z.array(districtRateSchema).min(1),
});

export const updateRatePlanSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  rates: z.array(districtRateSchema).min(1).optional(),
});

// ── Products ─────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  categoryId: z.string().uuid().optional(),
  ratePlanId: z.string().uuid().optional(),
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  unit: z.string().min(1),
  sourceRegion: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  stockQty: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  isBestSelling: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const adjustStockSchema = z.object({
  stockQty: z.number().int().min(0),
});

export const listAdminProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.coerce.boolean().optional(),
});

// ── Categories ───────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(2),
  nameBn: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// ── Banners ──────────────────────────────────────────────────────────────────

export const createBannerSchema = z.object({
  type: z.enum(['hero', 'side', 'promo']),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagText: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export const updateBannerSchema = createBannerSchema.partial();

// ── Orders ───────────────────────────────────────────────────────────────────

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]),
  note: z.string().max(500).optional(),
});

export const createManualOrderSchema = z.object({
  source: z.enum(['facebook', 'phone', 'admin']),
  paymentMethod: z.enum(['cash', 'card', 'gcash', 'bkash', 'nagad', 'manual']),
  notes: z.string().max(500).optional(),
  address: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(7),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    district: z.string().min(2),
    postalCode: z.string().optional(),
  }),
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1) }))
    .min(1),
});

export const listAdminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .optional(),
  q: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const listInventoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  lowStockOnly: z.coerce.boolean().default(false),
});

// ── Reports ──────────────────────────────────────────────────────────────────

export const salesReportQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  group: z.enum(['day', 'month']).default('day'),
});

export const topProductsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// ── Coupons ──────────────────────────────────────────────────────────────────

export const createCouponSchema = z.object({
  code: z.string().min(3).max(50).regex(/^[A-Z0-9_-]+$/i, 'Alphanumeric, hyphens, underscores only'),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  minOrderAmount: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();
