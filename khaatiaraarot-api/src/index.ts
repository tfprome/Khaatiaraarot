import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

export default app;
