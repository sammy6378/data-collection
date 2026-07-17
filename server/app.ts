import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import "dotenv/config";
import dataRouter from "./routes/dataRoute";

const app = express();

// Security headers
app.use(helmet());

//body parser – keep limit tight; cvFile is a URL string, not binary
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

// Strip MongoDB operator keys from user input
app.use(mongoSanitize());

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://data-collection-ruby.vercel.app",
  "https://data-collection-v4gr.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// routes
app.use("/", dataRouter);

// health-check
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API working correctly" });
});

// unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(
    `The route: ${req.originalUrl} does not exist`
  ) as any;
  error.statusCode = 404;
  next(error);
});

// Global error handler – never leak stack traces to the client
app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
  const status = error.statusCode || 500;
  const message =
    status === 404
      ? error.message
      : "An unexpected error occurred. Please try again.";
  res.status(status).json({ success: false, message });
});

export default app;
