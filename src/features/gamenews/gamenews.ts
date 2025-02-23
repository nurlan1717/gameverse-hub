import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../constants/api';


interface News {
    title?: string;
    category?: string;
    author?: string;
    description?: string;
    image?: File;
}
interface GameNews {
    breaking: Array<{
        _id: string;
        title: string;
        description: string;
        category: string;
        author: string;
        imageUrl: string;
        publishedDate: string;
        status: string;
    }>;
    trending: Array<{
        _id: string;
        title: string;
        description: string;
        category: string;
        author: string;
        imageUrl: string;
        publishedDate: string;
        status: string;
    }>;
    featured: Array<{
        _id: string;
        title: string;
        description: string;
        category: string;
        author: string;
        imageUrl: string;
        publishedDate: string;
        status: string;
    }>;
}


export const gameNewsApi = createApi({
    reducerPath: 'gameNewsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "gamenews" }),
    tagTypes: ['GameNews'],
    endpoints: (builder) => ({
        getGameNews: builder.query<GameNews, void>({
            query: () => '/',
            providesTags: ['GameNews'],
        }),
        getSingleGameNews: builder.query<GameNews, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'GameNews', id }],
        }),
        createGameNews: builder.mutation<GameNews, FormData>({
            query: (formData) => ({
                url: '/',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['GameNews'],
        }),
        updateGameNews: builder.mutation<void, { id: string; updates: FormData }>({
            query: ({ id, updates }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['GameNews'],
        }),

        deleteGameNews: builder.mutation<void, string>({
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