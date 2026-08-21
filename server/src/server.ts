import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import {connectDB} from "./db";
import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// 1. GLOBAL MIDDLEWARE: Runs before every API request
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB(); // Ensure DB is connected for this request
    next();            // Proceed to the route handler
  } catch (error) {
    console.error("Database connection failure:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: Database connection failed.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// 2. Mount your application routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Management API is running...");
});

// 3. LOCAL DEVELOPMENT GUARD: Only use app.listen() locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
  });
}

// 4. EXPORT APP: Vercel requires exporting the Express app as a serverless function handler
export default app;