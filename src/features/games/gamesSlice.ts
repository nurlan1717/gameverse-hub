import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, ADMIN_URL_BASE } from "../../constants/api";
import { Game } from "../../types/game";
import Cookies from 'js-cookie';

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      let token = (getState() as any).auth?.token;
      if (!token) {
        token = Cookies.get('token');
      }
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Games", "PendingGames"],
  endpoints: (builder) => ({
    fetchGames: builder.query<Game[], void>({
      query: () => "games",
      providesTags: ["Games"],
    }),
    getGames: builder.query({
      query: ({ limit, sort, freeWeekly }) => ({
        url: 'games',
        params: { limit, sort, freeWeekly },
      }),
    }),

    createGame: builder.mutation<Game, FormData>({
      query: (gameData) => ({
        url: "games",
        method: "POST",
        body: gameData,
      }),
      invalidatesTags: ["Games"],
    }),

    updateGame: builder.mutation<Game, { id: string; gameData: Partial<Game> }>({
      query: ({ id, gameData }) => ({
        url: `games/${id}`,
        method: "PUT",
        body: gameData,
      }),
      invalidatesTags: ["Games"],
    }),

    deleteGame: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `games/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Games"],
    }),

    fetchPendingGames: builder.query<Game[], void>({
      query: () => `${ADMIN_URL_BASE}admin/games/pending`,
      providesTags: ["PendingGames"],
    }),

    approveGame: builder.mutation<{ id: string }, string>({
      query: (gameId) => ({
        url: `${ADMIN_URL_BASE}admin/games/${gameId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["PendingGames", "Games"],
    }),

    rejectGame: builder.mutation<{ id: string }, string>({
      query: (gameId) => ({
        url: `${ADMIN_URL_BASE}admin/games/${gameId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["PendingGames"],
    }),
  }),
});

export const {
  useFetchGamesQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useFetchPendingGamesQuery,
  useApproveGameMutation,
  useRejectGameMutation,
  useGetGamesQuery,
} = gameApi;
