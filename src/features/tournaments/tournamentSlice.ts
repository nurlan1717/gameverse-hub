import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';


interface Tournament {
    id: string;
    name: string;
}

interface Team {
    id: string;
    name: string;
}

interface RegisterForTournamentArgs {
    tournamentId: string;
    teamId: string;
}

interface UpdateTournamentArgs {
    id: string;
    updates: Partial<Tournament>;
}

interface NewTournament {
    name: string;
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
    tagTypes: ['Tournaments', 'Teams'],
    endpoints: (builder) => ({
        getTournaments: builder.query<Tournament[], void>({
            query: () => '/',
            providesTags: ['Tournaments', 'Teams']
        }),
        getActiveTournaments: builder.query<Tournament[], void>({
            query: () => '/active',
            providesTags: ['Tournaments', 'Teams']
        }),

        registerForTournament: builder.mutation<void, RegisterForTournamentArgs>({
            query: ({ tournamentId, teamId }) => ({
                url: '/register',
                method: 'POST',
                body: { tournamentId, teamId },
            }),
            invalidatesTags: ['Tournaments', 'Teams'],
        }),

        createTournament: builder.mutation<void, NewTournament>({
            query: (newTournament) => ({
                url: '/',
                method: 'POST',
                body: newTournament,
            }),
            invalidatesTags: ['Tournaments', 'Teams'],
        }),

        updateTournament: builder.mutation<void, UpdateTournamentArgs>({
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