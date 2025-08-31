import { createSlice } from "@reduxjs/toolkit";
import type { rentalsInfo } from "../app/types/rentals";

const initialState: rentalsInfo[] = [];

const rentalsSlice = createSlice({
  name: "rentals",
  initialState,
  reducers: {
    setRentals: (state, action) => {
      return action.payload;
    },
  },
});

export const { setRentals } = rentalsSlice.actions;
export default rentalsSlice.reducer;
