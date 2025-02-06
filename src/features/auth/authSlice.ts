import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    data: {
        id: string;
        fullName: string;
        username: string;
        email: string;
        role: string;
        profileImage: string;
        wishlist: [];
        basket: [];
        provider: string;
        balance: number;
        couponsUsed: [];
        subscription: { plan: string }
    }
}

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        logout(state) {
            state.user = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
