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
router.get("/", getProperties);

// Route to get a single property by ID
router.get("/", getProperties);

// Route to create a new property
router.post("/", async (req, res) => {
  try {
    const newProperty = await createProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Route to update a property by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProperty = await updateProperty(req.params.id, req.body);
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Route to delete a property by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProperty = await deleteProperty(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

export default router;
