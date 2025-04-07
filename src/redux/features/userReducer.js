import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // User state
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateNotifications: (state, action) => {
      if (state.user) {
        state.user.notification = action.payload.notification;
        state.user.seennotification = action.payload.seennotification;
      }
    },
  },
});

export const { setUser, updateNotifications } = userSlice.actions;
export default userSlice.reducer;
