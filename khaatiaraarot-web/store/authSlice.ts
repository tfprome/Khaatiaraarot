import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    //token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (
          state
        ) => {
          state.isAuthenticated = true;
        },

        logout: (state) => {
            state.isAuthenticated = false;
        },

        // setUser: (state, action: PayloadAction<User>) => {
        //   state.user = action.payload;
        //   state.isAuthenticated = true;
        // },
    },
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;