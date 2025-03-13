import axios from "axios";

import { propertyDetailsAction } from "./propertyDetails-slice";

const API_URL = process.env.REACT_APP_API_URL; // Use environment variable for backend URL


export const getPropertyDetails = (id) => async (dispatch) => {
  try {
    dispatch(propertyDetailsAction.getListRequest());

    const response = await axios.get(`${API_URL}/${id}`);

    if (!response) {
      throw new Error("Could not fetch any property details");
    }

    const { data } = response.data;

    dispatch(propertyDetailsAction.getPropertyDetails(data));
  } catch (error) {
    dispatch(propertyDetailsAction.getErrors(error.response.data.error));
  }
};
