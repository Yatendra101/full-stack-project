import axios from "axios";
import { userActions } from "./user-slice";

const API_URL = process.env.REACT_APP_API_URL; // Use environment variable for backend URL

//handle user Signup
export const getSignUp = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getSignupRequest());
    const { data } = await axios.post(`${API_URL}/user/signup`, user);

    dispatch(userActions.getSignupDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

//handle user login
export const getLogIn = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getLoginRequest());
    const { data } = await axios.post(`${API_URL}/user/login`, user);
    dispatch(userActions.getLoginDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

// get current user information

export const currentUser = () => async (dispatch) => {
  try {
    dispatch(userActions.getCurrentUserRequest());
    const { data } = await axios.get(`${API_URL}/user/me`);
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

// to update user information
export const updateUser = (updateUser) => async (dispatch) => {
  try {
    dispatch(userActions.getUpdateUserRequest());
    await axios.patch(`${API_URL}/user/updateMe`, updateUser);
    const { data } = await axios.get(`${API_URL}/user/me`);
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

//to handle forgot password

export const forgotPassword = (email) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/user/forgotPassword`, { email });
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

// password reset
export const resetPassword = (repassword, token) => async (dispatch) => {
  try {
    await axios.patch(`${API_URL}/user/resetPassword/${token}`, repassword);
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

//password update
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(userActions.getPasswordRequest());
    await axios.patch(`${API_URL}/user/updateMyPassword`, passwords);
    dispatch(userActions.getPasswordSuccess(true));
  } catch (error) {
    dispatch(userActions.getError(error.response.data.message));
  }
};

//user Logout
export const Logout = () => async (dispatch) => {
  try {
    await axios.get(`${API_URL}/user/logout`);
    dispatch(userActions.getLogout(null));
  } catch (error) {
    dispatch(userActions.getError(error));
  }
};
