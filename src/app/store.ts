import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../features/user/usersSlice';
import authReducer from '../features/auth/authSlice';
import { teamApi } from '../features/teams/teamsSlice';
import { gameApi } from '../features/games/gamesSlice';
import { oauthApi } from '../features/oauth/oauth';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [teamApi.reducerPath]: teamApi.reducer,
        [gameApi.reducerPath]: gameApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [oauthApi.reducerPath]: oauthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, teamApi.middleware, gameApi.middleware, oauthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
