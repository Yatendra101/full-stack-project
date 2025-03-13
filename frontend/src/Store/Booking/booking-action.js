import axios from "axios";
import { addBooking, setBookings, setBookingDetails } from "./booking-slice";

const API_URL = process.env.REACT_APP_API_URL; // Use environment variable for backend URL

export const createBooking = (bookingDate) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/booking/new`,
      bookingDate
    );
    dispatch(addBooking(response.data.data.booking));
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};

export const fetchBookingDetails = (bookingId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/user/booking/${bookingId}`);
    dispatch(setBookingDetails(response.data.data));
  } catch (error) {
    console.error("Error fetching booking details", error);
  }
};

export const fetchUserBookings = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/user/booking`);
    dispatch(setBookings(response.data.data.bookings));
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
};
