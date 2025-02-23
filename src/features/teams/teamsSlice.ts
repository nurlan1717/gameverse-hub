import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { BASE_URL } from "../../constants/api";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}teams`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: () => "/",
      providesTags: ["Team"],
    }),
    createTeam: builder.mutation({
      query: (teamData) => ({
        url: "/",
        method: "POST",
        body: teamData,
      }),
      invalidatesTags: ["Team"],
    }),
    addMember: builder.mutation({
      query: ({ teamId, userId }) => ({
        url: `/${teamId}/members`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Team"],
    }),
    removeMember: builder.mutation({
      query: ({ teamId, memberId }) => ({
        url: `/${teamId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
    registerForTournament: builder.mutation({
      query: ({ teamId, tournamentId }) => ({
        url: "/register",
        method: "POST",
        body: { teamId, tournamentId },
      }),
      invalidatesTags: ["Team"],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useRegisterForTournamentMutation,
  useDeleteTeamMutation,
} = teamApi;