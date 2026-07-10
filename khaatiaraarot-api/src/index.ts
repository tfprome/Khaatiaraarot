import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { BANGLADESH_DISTRICTS } from "./constants/districts";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import bannerRoutes from "./routes/banner.routes";
import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import rewardRoutes from "./routes/reward.routes";
import couponRoutes from "./routes/coupon.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import adminRoutes from "./routes/admin";
import { errorHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { generalLimiter, authLimiter } from "./middleware/rateLimiter.middleware";
import { startWorkers } from "./queues/workers";
import { logger } from "./config/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', false);

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(generalLimiter);

app.use("/api/v1/docs",
  helmet({ contentSecurityPolicy: false }),
  (req: express.Request, _res: express.Response, next: express.NextFunction) => { req.headers['x-forwarded-proto'] = 'http'; next(); },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/rewards", rewardRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/admin", adminRoutes);
app.get("/api/v1/districts", (_req, res) => res.json({ success: true, data: BANGLADESH_DISTRICTS }));

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API running on port ${PORT}`);
  startWorkers();
});

export default app;
