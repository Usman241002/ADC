import { configureStore } from "@reduxjs/toolkit";
import vehiclesReducer from "../features/vehiclesSlice";
import rentalsReducer from "../features/rentalsSlice";
import paymentsReducer from "../features/paymentsSlice";
import notificationsReducer from "../features/notificationsSlice";

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    rentals: rentalsReducer,
    payments: paymentsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
