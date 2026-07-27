import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import categoryRouter from "./routes/category.routes";
import subCategoryRouter from "./routes/subcategory.routes";

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

// Error Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
