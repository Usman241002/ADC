import { createSlice } from "@reduxjs/toolkit";

const initialState: string[] = [];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      return action.payload;
    },
    deleteNotification: (state, action) => {
      const index = state.findIndex(
        (notification) => notification.id === action.payload,
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    clearNotifications: (state) => {
      return initialState;
    },
  },
});

export const { setNotifications, deleteNotification, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
