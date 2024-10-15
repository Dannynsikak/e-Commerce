import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRouter from "./routers/productRouter";
import seedRouter from "./routers/seedRouter";
import { userRouter } from "./routers/userRouter";
import orderRoute from "./routers/orderRoute";
import { keyRouter } from "./routers/keyRouter";

dotenv.config();
const config = process.env;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/tsamazonadb";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

const app = express();
const PORT = 4000;

// Use morgan for logging HTTP requests
app.use(morgan("dev"));

// Use cookie parser for handling cookies
app.use(cookieParser());

// Define CORS options with credentials and allowed origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ],
  credentials: true, // Allow credentials (cookies, authorization headers)
  preflightContinue: true, // Allow preflight requests to pass
};

// Apply CORS middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Access control headers to manage allowed methods, headers, and credentials
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  const origin = req.get("origin") || req.get("referer");
  res.header("Access-Control-Allow-Origin", origin); // Dynamically allow CORS based on request origin

  next();
});

// Preflight support across the board
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRoute);
app.use("/api/seed", seedRouter);
app.use("/api/keys", keyRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });
