import { configureStore } from "@reduxjs/toolkit";
import vehiclesReducer from "../features/vehiclesSlice";
import rentalsReducer from "../features/rentalsSlice";

export const store = configureStore({
  reducer: { vehicles: vehiclesReducer, rentals: rentalsReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
