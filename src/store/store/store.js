import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../reducers/authReducer";
import { medicineReducer } from "../reducers/MedicineReducer";
import { errorReducer } from "../reducers/errorReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medicine: medicineReducer,
    error: errorReducer,
  },
});

export default store;