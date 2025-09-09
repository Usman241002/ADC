import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  // Add other user properties as needed
}

interface UsersState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
}

const initialState: UsersState = {
  isLoggedIn: false,
  user: null,
  isLoading: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.isLoading = false;
    },
    userLogout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: PayloadAction<any>) => {
      // Handle rehydration from persist
      if (action.payload && action.payload.users) {
        return { ...state, ...action.payload.users };
      }
    });
  },
});

export const { userLogin, userLogout, setLoading } = usersSlice.actions;
export default usersSlice.reducer;
