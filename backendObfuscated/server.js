import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: "*", // Allow requests from any origin (change this in production)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());

// MongoDB connection
const DB = process.env.MONGO_URI;

if (!DB) {
  console.error("❌ MongoDB URI is missing. Set MONGO_URI in your .env file.");
  process.exit(1);
}

console.log("Connecting to MongoDB:", DB);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Sample route to check if the backend is running
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Vercel!");
});

// Import your routes
import propertyRoutes from "./routes/propertyRoutes.js";
app.use("/api/v1/rent", propertyRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));

// Vercel requires module export
export default app;
