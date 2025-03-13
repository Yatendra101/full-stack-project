import axios from "axios";
import { accomodationActions } from "./Accomodation-slice";

const API_URL = process.env.REACT_APP_API_URL; // Use environment variable for backend URL

export const createAccomodation = (accomodationData) => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());
    const response = await axios.post(
      `${API_URL}/user/newAccommodation`,
      accomodationData
    );
    if (!response) {
      throw Error("Could not get any Accomodation");
    }
  } catch (error) {
    dispatch(accomodationActions.getErrors(error.response.data.message));
  }
};

export const getAllAccomodation = () => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());
    const { data } = await axios.get(`${API_URL}/user/myAccommodation`);
    const accom = data.data;
    dispatch(accomodationActions.getAccomodation(accom));
  } catch (error) {
    dispatch(accomodationActions.getErrors(error.response.data.message));
  }
};
