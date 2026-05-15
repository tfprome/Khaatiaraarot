import { sql, notInArray, eq, and, gte, lte, desc, asc } from 'drizzle-orm';
import { db } from '../../config/db';
import { orders, orderItems, products, categories } from '../../db/schema';
import type { salesReportQuerySchema, topProductsQuerySchema } from '../../schemas/admin.schema';
import type { z } from 'zod';

type SalesQuery = z.infer<typeof salesReportQuerySchema>;
type TopProductsQuery = z.infer<typeof topProductsQuerySchema>;

// Statuses excluded from revenue calculations
const EXCLUDED = ['cancelled', 'refunded'] as const;

function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from, to };
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboard() {
  const [
    todayResult,
    monthResult,
    yearResult,
    allTimeResult,
    pendingResult,
    lowStockResult,
    statusResult,
    recentResult,
  ] = await Promise.all([
    // Today revenue + orders
    db.execute<{ count: number; revenue: string }>(sql`
      SELECT COUNT(*)::int AS count,
             COALESCE(SUM(total::numeric), 0)::text AS revenue
      FROM orders
      WHERE DATE(created_at AT TIME ZONE 'UTC') = CURRENT_DATE
        AND status NOT IN ('cancelled', 'refunded')
    `),

    // This month
    db.execute<{ count: number; revenue: string }>(sql`
      SELECT COUNT(*)::int AS count,
             COALESCE(SUM(total::numeric), 0)::text AS revenue
      FROM orders
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        AND status NOT IN ('cancelled', 'refunded')
    `),

    // This year
    db.execute<{ count: number; revenue: string }>(sql`
      SELECT COUNT(*)::int AS count,
             COALESCE(SUM(total::numeric), 0)::text AS revenue
      FROM orders
      WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND status NOT IN ('cancelled', 'refunded')
    `),

    // All time
    db.execute<{ count: number; revenue: string }>(sql`
      SELECT COUNT(*)::int AS count,
             COALESCE(SUM(total::numeric), 0)::text AS revenue
      FROM orders
      WHERE status NOT IN ('cancelled', 'refunded')
    `),

    // Pending orders count
    db.execute<{ count: number }>(sql`
      SELECT COUNT(*)::int AS count FROM orders WHERE status = 'pending'
    `),

    // Low stock products
    db.execute<{ count: number }>(sql`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE is_active = true AND stock_qty <= low_stock_threshold
    `),

    // Order status distribution
    db.execute<{ status: string; count: number }>(sql`
      SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status ORDER BY count DESC
    `),

    // Recent 5 orders
    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        total: orders.total,
        paymentMethod: orders.paymentMethod,
        source: orders.source,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5),
  ]);

  const today = todayResult.rows[0];
  const month = monthResult.rows[0];
  const year = yearResult.rows[0];
  const allTime = allTimeResult.rows[0];

  return {
    revenue: {
      today: parseFloat(today?.revenue ?? '0'),
      thisMonth: parseFloat(month?.revenue ?? '0'),
      thisYear: parseFloat(year?.revenue ?? '0'),
      allTime: parseFloat(allTime?.revenue ?? '0'),
    },
    orders: {
      today: today?.count ?? 0,
      thisMonth: month?.count ?? 0,
      thisYear: year?.count ?? 0,
      allTime: allTime?.count ?? 0,
      pending: pendingResult.rows[0]?.count ?? 0,
    },
    lowStockCount: lowStockResult.rows[0]?.count ?? 0,
    statusDistribution: statusResult.rows,
    recentOrders: recentResult,
  };
}

// ── Sales over time ───────────────────────────────────────────────────────────

export async function getSalesReport(query: SalesQuery) {
  const { group } = query;
  const from = query.from ? new Date(query.from) : defaultDateRange().from;
  const to = query.to ? new Date(query.to) : new Date();

  const periodExpr =
    group === 'day'
      ? sql`DATE(created_at)::text`
      : sql`TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM')`;

  const rows = await db.execute<{
    period: string;
    order_count: number;
    revenue: string;
    avg_order_value: string;
  }>(sql`
    SELECT
      ${periodExpr} AS period,
      COUNT(*)::int AS order_count,
      COALESCE(SUM(total::numeric), 0)::text AS revenue,
      COALESCE(AVG(total::numeric), 0)::text AS avg_order_value
    FROM orders
    WHERE created_at >= ${from}
      AND created_at <= ${to}
      AND status NOT IN ('cancelled', 'refunded')
    GROUP BY period
    ORDER BY period ASC
  `);

  // Summary totals for the period
  const summaryResult = await db.execute<{
    total_orders: number;
    total_revenue: string;
    total_cancelled: number;
  }>(sql`
    SELECT
      COUNT(*) FILTER (WHERE status NOT IN ('cancelled', 'refunded'))::int AS total_orders,
      COALESCE(SUM(total::numeric) FILTER (WHERE status NOT IN ('cancelled', 'refunded')), 0)::text AS total_revenue,
      COUNT(*) FILTER (WHERE status = 'cancelled')::int AS total_cancelled
    FROM orders
    WHERE created_at >= ${from} AND created_at <= ${to}
  `);

  const summary = summaryResult.rows[0];

  return {
    group,
    from: from.toISOString(),
    to: to.toISOString(),
    summary: {
      totalOrders: summary?.total_orders ?? 0,
      totalRevenue: parseFloat(summary?.total_revenue ?? '0'),
      totalCancelled: summary?.total_cancelled ?? 0,
    },
    data: rows.rows.map((r) => ({
      period: r.period,
      orderCount: r.order_count,
      revenue: parseFloat(r.revenue),
      avgOrderValue: parseFloat(r.avg_order_value),
    })),
  };
}

// ── Top products ──────────────────────────────────────────────────────────────

export async function getTopProducts(query: TopProductsQuery) {
  const from = query.from ? new Date(query.from) : defaultDateRange().from;
  const to = query.to ? new Date(query.to) : new Date();
  const limit = query.limit;

  const rows = await db.execute<{
    product_id: string;
    name: string;
    unit: string;
    units_sold: number;
    revenue: string;
    order_count: number;
  }>(sql`
    SELECT
      p.id AS product_id,
      p.name,
      p.unit,
      SUM(oi.quantity)::int AS units_sold,
      SUM(oi.total_price::numeric)::text AS revenue,
      COUNT(DISTINCT oi.order_id)::int AS order_count
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at >= ${from}
      AND o.created_at <= ${to}
      AND o.status NOT IN ('cancelled', 'refunded')
    GROUP BY p.id, p.name, p.unit
    ORDER BY revenue DESC
    LIMIT ${limit}
  `);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    data: rows.rows.map((r) => ({
      productId: r.product_id,
      name: r.name,
      unit: r.unit,
      unitsSold: r.units_sold,
      revenue: parseFloat(r.revenue),
      orderCount: r.order_count,
    })),
  };
}

// ── Top categories ────────────────────────────────────────────────────────────

export async function getTopCategories(query: TopProductsQuery) {
  const from = query.from ? new Date(query.from) : defaultDateRange().from;
  const to = query.to ? new Date(query.to) : new Date();

  const rows = await db.execute<{
    category_id: string;
    name: string;
    slug: string;
    units_sold: number;
    revenue: string;
    order_count: number;
  }>(sql`
    SELECT
      c.id AS category_id,
      c.name,
      c.slug,
      SUM(oi.quantity)::int AS units_sold,
      SUM(oi.total_price::numeric)::text AS revenue,
      COUNT(DISTINCT oi.order_id)::int AS order_count
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at >= ${from}
      AND o.created_at <= ${to}
      AND o.status NOT IN ('cancelled', 'refunded')
    GROUP BY c.id, c.name, c.slug
    ORDER BY revenue DESC
  `);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    data: rows.rows.map((r) => ({
      categoryId: r.category_id,
      name: r.name,
      slug: r.slug,
      unitsSold: r.units_sold,
      revenue: parseFloat(r.revenue),
      orderCount: r.order_count,
    })),
  };
}

// ── Revenue summary ───────────────────────────────────────────────────────────

export async function getRevenueSummary(query: TopProductsQuery) {
  const from = query.from ? new Date(query.from) : defaultDateRange().from;
  const to = query.to ? new Date(query.to) : new Date();

  const [periodResult, byPaymentResult, bySourceResult] = await Promise.all([
    db.execute<{ revenue: string; order_count: number; avg_order: string }>(sql`
      SELECT
        COALESCE(SUM(total::numeric), 0)::text AS revenue,
        COUNT(*)::int AS order_count,
        COALESCE(AVG(total::numeric), 0)::text AS avg_order
      FROM orders
      WHERE created_at >= ${from}
        AND created_at <= ${to}
        AND status NOT IN ('cancelled', 'refunded')
    `),

    db.execute<{ payment_method: string; count: number; revenue: string }>(sql`
      SELECT
        payment_method,
        COUNT(*)::int AS count,
        SUM(total::numeric)::text AS revenue
      FROM orders
      WHERE created_at >= ${from}
        AND created_at <= ${to}
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY payment_method
      ORDER BY revenue DESC
    `),

    db.execute<{ source: string; count: number; revenue: string }>(sql`
      SELECT
        source,
        COUNT(*)::int AS count,
        SUM(total::numeric)::text AS revenue
      FROM orders
      WHERE created_at >= ${from}
        AND created_at <= ${to}
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY source
      ORDER BY revenue DESC
    `),
  ]);

  const period = periodResult.rows[0];

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    summary: {
      revenue: parseFloat(period?.revenue ?? '0'),
      orderCount: period?.order_count ?? 0,
      avgOrderValue: parseFloat(period?.avg_order ?? '0'),
    },
    byPaymentMethod: byPaymentResult.rows.map((r) => ({
      paymentMethod: r.payment_method,
      count: r.count,
      revenue: parseFloat(r.revenue),
    })),
    bySource: bySourceResult.rows.map((r) => ({
      source: r.source,
      count: r.count,
      revenue: parseFloat(r.revenue),
    })),
  };
}
