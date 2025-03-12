import axios from "axios";

import { propertyAction } from "./property-slice";

const API_URL = process.env.REACT_APP_API_URL; // Use environment variable for backend URL

//action creator to fetch properties
export const getAllProperties = () => async (dispatch, getState) => {
  try {
    dispatch(propertyAction.getRequest());

    const { searchParams } = getState().properties;

    const response = await axios.get(`${API_URL}/api/v1/rent/listing`, {
      params: { ...searchParams },
    });

    console.log(response);
    if (!response) {
      throw new Error("Could not fetch any properties");
    }

    const { data } = response;
    dispatch(propertyAction.getProperties(data));
  } catch (error) {
    dispatch(propertyAction.getErrors(error.message));
  }
};
