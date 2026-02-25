import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../reducers/authReducer";
import { medicineReducer } from "../reducers/MedicineReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medicine: medicineReducer,
  },
});

export default store;