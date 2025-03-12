import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const DB = process.env.DATABASE_LOCAL || process.env.MONGO_URI;
console.log("Connecting to MongoDB:", DB);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Sample route
app.get("/", (req, res) => {
  res.send("Backend is running on Vercel!");
});

// Import your routes here
import propertyRoutes from "./routes/propertyRoutes.js";
app.use("/api/v1/rent", propertyRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});

export default app;
