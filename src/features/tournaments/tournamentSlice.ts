import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';


interface Tournament {
    _id: string;
    name: string;
    game: string;
    startDate: string;
    endDate: string;
    participants: string[];
}

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
        getActiveTournaments: builder.query<Tournament[], void>({
            query: () => '/active',
            providesTags: ['Tournaments'],
        }),

        registerForTournament: builder.mutation<void, { tournamentId: string }>({
            query: ({ tournamentId }) => ({
                url: '/register',
                method: 'POST',
                body: { tournamentId },
            }),
            invalidatesTags: ['Tournaments'],
        }),

        createTournament: builder.mutation<Tournament, Omit<Tournament, '_id' | 'participants'>>({
            query: (newTournament) => ({
                url: '/',
                method: 'POST',
                body: newTournament,
            }),
            invalidatesTags: ['Tournaments'],
        }),

        updateTournament: builder.mutation<Tournament, Partial<Tournament> & { _id: string }>({
            query: ({ _id, ...updates }) => ({
                url: `/${_id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Tournaments'],
        }),

        deleteTournament: builder.mutation<void, string>({
            query: (tournamentId) => ({
                url: `/${tournamentId}`,
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