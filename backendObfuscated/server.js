import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const DB = process.env.MONGO_URI || process.env.DATABASE_LOCAL;
console.log("Connecting to MongoDB...");

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

// Sample Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Vercel!");
});

// Import and Use Routes
import propertyRoutes from "./routes/propertyRoutes.js";
app.use("/api/v1/rent", propertyRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});

export default app; // Required for Vercel
