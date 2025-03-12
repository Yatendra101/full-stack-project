import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Use MongoDB Atlas connection
const DB = process.env.MONGO_URI; // Ensure this is coming from .env
console.log("Connecting to MongoDB:", DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop the server if DB fails
  });

// Sample route to check if the server is running
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Vercel!");
});

// Import your routes
import propertyRoutes from "./routes/propertyRoutes.js";
app.use("/api/v1/rent", propertyRoutes);

// Start the server only if not in Vercel Serverless Function
const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
}

// Vercel requires module export
export default app;
