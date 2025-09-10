import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "@reduxjs/toolkit";
import vehiclesReducer from "../features/vehiclesSlice";
import rentalsReducer from "../features/rentalsSlice";
import paymentsReducer from "../features/paymentsSlice";
import notificationsReducer from "../features/notificationsSlice";
import usersReducer from "../features/usersSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["users"], // Only persist users slice
  // blacklist: ["notifications"], // Don't persist notifications
};

const rootReducer = combineReducers({
  vehicles: vehiclesReducer,
  rentals: rentalsReducer,
  payments: paymentsReducer,
  notifications: notificationsReducer,
  users: usersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
