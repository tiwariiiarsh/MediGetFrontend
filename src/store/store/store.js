import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../reducers/authReducer";

const initialState = {

};

export const store = configureStore({
  reducer:{
    auth: authReducer,
  },
  preloadedState:initialState,
});

export default store;