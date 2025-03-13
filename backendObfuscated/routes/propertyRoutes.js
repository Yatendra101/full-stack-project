import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

// Route to get all properties
router.get("/listing", getProperties);

// Route to get a single property by ID
router.get("/:id", getProperty);

// Route to create a new property
router.post("/", createProperty);

// Route to update a property by ID
router.put("/:id", updateProperty);

// Route to delete a property by ID
router.delete("/:id", deleteProperty);

export default router;
