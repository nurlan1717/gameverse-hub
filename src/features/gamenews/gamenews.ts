import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../constants/api';

export const gameNewsApi = createApi({
    reducerPath: 'gameNewsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "gamenews" }), 
    tagTypes: ['GameNews'],
    endpoints: (builder) => ({
        getGameNews: builder.query({
            query: () => '/',
            providesTags: ['GameNews'],
        }),
        getSingleGameNews: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'GameNews', id }],
        }),
        createGameNews: builder.mutation({
            query: (formData) => ({
                url: '/',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['GameNews'],
        }),
        updateGameNews: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'GameNews', id }],
        }),
        deleteGameNews: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['GameNews'],
        }),
    }),
});

export const {
    useGetGameNewsQuery,
    useGetSingleGameNewsQuery,
    useCreateGameNewsMutation,
    useUpdateGameNewsMutation,
    useDeleteGameNewsMutation,
} = gameNewsApi;
