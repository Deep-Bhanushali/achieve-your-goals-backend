import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, initializeTables } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "https://mango-admi.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database and initialize tables
connectDB().then(() => {
  initializeTables();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // PostgreSQL unique constraint violation
  if (err.code === "23505") {
    return res.status(409).json({ message: "Duplicate entry" });
  }

  // PostgreSQL not null violation
  if (err.code === "23502") {
    return res.status(400).json({ message: "Missing required field" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
