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
    tagTypes: ['Tournaments', 'Teams'],
    endpoints: (builder) => ({
        getTournaments: builder.query<any, void>({
            query: () => '/',
            providesTags: ['Tournaments', 'Teams']
        }),
        getActiveTournaments: builder.query<any, void>({
            query: () => '/active',
            providesTags: ['Tournaments', 'Teams']
        }),

        registerForTournament: builder.mutation<void, any>({
            query: ({ tournamentId, teamId }) => ({
                url: '/register',
                method: 'POST',
                body: { tournamentId, teamId },
            }),
            invalidatesTags: ['Tournaments', 'Teams'],
        }),

        createTournament: builder.mutation<void, any>({
            query: (newTournament) => ({
                url: '/',
                method: 'POST',
                body: newTournament,
            }),
            invalidatesTags: ['Tournaments', 'Teams'],
        }),

        updateTournament: builder.mutation<void, any>({
            query: ({ id, updates }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Tournaments', 'Teams'],
        }),

        setTournamentActive: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tournaments/${id}/activate`,
                method: 'PUT',
            }),
            invalidatesTags: ['Tournaments', 'Teams'],
        }),

        deleteTournament: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tournaments', 'Teams'],
        }),
    }),
});

export const {
    useGetTournamentsQuery,
    useGetActiveTournamentsQuery,
    useRegisterForTournamentMutation,
    useCreateTournamentMutation,
    useUpdateTournamentMutation,
    useSetTournamentActiveMutation,
    useDeleteTournamentMutation,
} = tournamentsApi;