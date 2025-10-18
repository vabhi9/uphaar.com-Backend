import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.router.js";
dotenv.config({
  path: "./.env",
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log("CIRS_ORIGIN is:",process.env.CORS_ORIGIN);

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  console.log("CORS Headers:", res.getHeaders());
  next();
});

// app.use((req, res, next) => {
// res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
// res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/product", productRouter);
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);

export default app;
