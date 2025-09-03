import { configureStore } from "@reduxjs/toolkit";
import vehiclesReducer from "../features/vehiclesSlice";
import rentalsReducer from "../features/rentalsSlice";
import paymentsReducer from "../features/paymentsSlice";

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    rentals: rentalsReducer,
    payments: paymentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
