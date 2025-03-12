import Property from "../Models/propertyModel.js";
import APIFeatures from "../utils/APIFeatures.js";

// Get a single property by ID
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.status(200).json({ status: "success", data: property });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Create a new property
export const createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body, userId: req.user.id };
    const newProperty = await Property.create(propertyData);

    res.status(200).json({ status: "success", data: { data: newProperty } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Get all properties with filtering, sorting, and pagination
export const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(Property.find(), req.query)
      .filter()
      .search()
      .paginate();

    const allProperties = await Property.find();
    const filteredProperties = await features.query;

    res.status(200).json({
      status: "success",
      no_of_responses: filteredProperties.length,
      all_Properties: allProperties.length,
      data: filteredProperties,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get properties created by a specific user
export const getUsersProperties = async (req, res) => {
  try {
    const userId = req.params.id;
    const userProperties = await Property.find({ userId });

    res.status(200).json({
      status: "success",
      data_length: userProperties.length,
      data: userProperties,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
