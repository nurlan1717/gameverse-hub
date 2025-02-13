import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../features/user/usersSlice';
import authReducer from '../features/auth/authSlice';
import { teamApi } from '../features/teams/teamsSlice';
import { gameApi } from '../features/games/gamesSlice';
import { oauthApi } from '../features/oauth/oauth';
import { gameNewsApi } from '../features/gamenews/gamenews';
import { tournamentsApi } from '../features/tournaments/tournamentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [teamApi.reducerPath]: teamApi.reducer,
        [gameApi.reducerPath]: gameApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [oauthApi.reducerPath]: oauthApi.reducer,
        [gameNewsApi.reducerPath]: gameNewsApi.reducer,
        [tournamentsApi.reducerPath]: tournamentsApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, teamApi.middleware, gameApi.middleware, oauthApi.middleware, gameNewsApi.middleware, tournamentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
