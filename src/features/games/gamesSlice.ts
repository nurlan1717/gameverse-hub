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
      query: ({ limit, sort, freeWeekly, genre }) => ({
        url: 'games',
        params: { limit, sort, freeWeekly, genre },
      }),
    }),

    getGamesById: builder.query({
      query: (id) => `games/${id}`,
      providesTags: ["Games"],
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
      query: () => `${ADMIN_URL_BASE}api/games/admin/games/pending`,
      providesTags: ["PendingGames"],
    }),

    approveGame: builder.mutation<{ id: string }, string>({
      query: (gameId) => ({
        url: `${ADMIN_URL_BASE}api/games/admin/games/${gameId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["PendingGames", "Games"],
    }),

    rejectGame: builder.mutation<{ id: string }, string>({
      query: (gameId) => ({
        url: `${ADMIN_URL_BASE}api/games/admin/games/${gameId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["PendingGames"],
    }),

    uploadGameFile: builder.mutation<
      { message: string; fileUrl: string; game: Game },
      { gameId: string; file: File }
    >({
      query: ({ gameId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `upload/${gameId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Games"],
    }),
    rateGame: builder.mutation({
      query: ({ gameId, userId, rating }) => ({
        url: `/games/${gameId}/rate`,
        method: 'POST',
        body: { userId, rating },
      }),
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
  useGetGamesByIdQuery,
  useUploadGameFileMutation,
  useRateGameMutation,
} = gameApi;
