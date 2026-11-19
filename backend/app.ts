import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import subCategoryRouter from "./routes/subcategory.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import reviewRouter from "./routes/reviews.routes.js";

// Creating express server
const app = express();
const PORT = process.env.PORT || 5000;

// Basic Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [String(process.env.FRONTEND_URL)],
    credentials: true,
  }),
);
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/review", reviewRouter);

// Error Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
