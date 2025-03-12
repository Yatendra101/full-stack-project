import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
  //Slice name:
  name: "property",
  //Intial state for the property slice

  initialState: {
    properties: [],
    totalProperties: 0,
    searchParams: {}, //Parameters used to search
    error: null, //Error State
    loading: false, //loading state for the property
  },

  //reducers functions to handle different functions
  reducers: {
    getRequest(state) {
      state.loading = true;
    },
    //Action to update properties state with fetch data
    getProperties(state, action) {
      state.properties = action.payload.data;
      state.totalProperties = action.payload.all_properties;
      state.loading = false;
    },

    //Action to search parameters
    updateSearchParams: (state, action) => {
      state.searchParams =
        Object.keys(action.payload).length === 0
          ? {}
          : {
              ...state.searchParams,
              ...action.payload,
            };
    },

    //Action to update  error state
    getErrors(state, action) {
      state.error = action.payload;
    },
  },
});

export const propertyAction = propertySlice.actions;

export default propertySlice;
