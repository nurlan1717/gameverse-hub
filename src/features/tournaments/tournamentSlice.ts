import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';


export const tournamentsApi = createApi({
    reducerPath: 'tournamentsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL + 'tournaments',
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Tournaments'],
    endpoints: (builder) => ({
        getActiveTournaments: builder.query({
            query: () => '/active',
            providesTags: ['Tournaments'],
        }),

        registerForTournament: builder.mutation({
            query: ({ tournamentId, teamId }) => ({
                url: '/register',
                method: 'POST',
                body: { tournamentId, teamId },
            }),
            invalidatesTags: ['Tournaments'],
        }),

        createTournament: builder.mutation({
            query: (newTournament) => ({
                url: '/',
                method: 'POST',
                body: newTournament,
            }),
            invalidatesTags: ['Tournaments'],
        }),

        updateTournament: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Tournaments'],
        }),

        deleteTournament: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tournaments'],
        }),
    }),
});

export const {
    useGetActiveTournamentsQuery,
    useRegisterForTournamentMutation,
    useCreateTournamentMutation,
    useUpdateTournamentMutation,
    useDeleteTournamentMutation,
} = tournamentsApi;