import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import dataRouter from "./routes/dataRoute";

const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// routes
app.use("/api/v1", dataRouter);

//test
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: "API working correctly" });
});

//unknown routes
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const error = new Error(
//     `The route: ${req.originalUrl} does not exist`
//   ) as any;
//   error.statusCode = 404;
//   next(error);
// });

// //404 page - Error handler middleware
// app.use((error: any, req: Request, res: Response, next: NextFunction) => {
//   res
//     .status(error.statusCode || 500)
//     .json({ success: false, message: error.message });
// });

export default app;
