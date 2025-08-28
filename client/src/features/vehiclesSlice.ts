import { createSlice } from "@reduxjs/toolkit";
import type { vehicleDetails } from "../app/types/vehicles";

const initialState: vehicleDetails[] = [];

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setVehicles: (state, action) => {
      return action.payload;
    },
  },
});

export const { setVehicles } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
