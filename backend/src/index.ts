import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRouter from "./routers/productRouter";
import seedRouter from "./routers/seedRouter";

dotenv.config();
const config = process.env;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/tsamazonadb";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(() => {
    console.log("error mongodb");
  });

const app = express();
const PORT = 4000;

// Use morgan for logging HTTP requests
app.use(morgan("dev"));

// Use cookie parser for handling cookies
app.use(cookieParser(config.TOKEN));

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
app.use(cors(corsOptions));

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

app.use("/api/products", productRouter);
app.use("/api/seed", seedRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
