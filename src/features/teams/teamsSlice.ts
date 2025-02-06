import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { Team } from "../../types/team";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", 
  }),
  tagTypes: ["Teams"],
  endpoints: (builder) => ({
    fetchTeams: builder.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),

    createTeam: builder.mutation<Team, { name: string; description: string }>({
      query: (teamData) => ({
        url: "teams",
        method: "POST",
        body: teamData,
      }),
      invalidatesTags: ["Teams"],
    }),

    addMember: builder.mutation<void, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `teams/${teamId}/members`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Teams"],
    }),

    removeMember: builder.mutation<void, { teamId: string; memberId: string }>({
      query: ({ teamId, memberId }) => ({
        url: `teams/${teamId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teams"],
    }),

    deleteTeam: builder.mutation<void, string>({
      query: (teamId) => ({
        url: `teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teams"],
    }),
  }),
});

export const {
  useFetchTeamsQuery,
  useCreateTeamMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useDeleteTeamMutation,
} = teamApi;
