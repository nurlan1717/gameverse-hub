import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';

type User = {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  profileImage: string;
  balance: number;
  basket: [];
  wishlist: [];
};

type Game = {
  _id: string;
  title: string;
  description: string;
  coverPhotoUrl: string;
  videoTrailerUrl: string;
  rating: number;
  price: number;
  genre: string;
  platform: string;
  systemRequirements: string;
  freeWeekly: boolean;
  approved: boolean;
  developerId: string;
  sales: number;
  createdAt: Date;
};

type WishlistItem = {
  _id: string;
  gameId: Game;
};

type BasketItem = {
  _id: string;
  gameId: Game;
  quantity: number;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Wishlist', 'Basket'],

  endpoints: (builder) => ({
    getUsers: builder.query<any, void>({
      query: () => 'users',
      providesTags: ['User'],
    }),

    getUserByUsername: builder.query<any, string>({
      query: (username) => `users/username/${username}`, // Backend endpoint
      providesTags: (result, error, username) => [{ type: 'User', username }],
    }),

    getUserById: builder.query<any, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    registerUser: builder.mutation<any, Record<string, any>>({
      query: (userData) => ({
        url: 'users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    registerDeveloper: builder.mutation<any, Record<string, any>>({
      query: (devData) => ({
        url: 'users/dev/register',
        method: 'POST',
        body: devData,
      }),
    }),

    loginUser: builder.mutation<any, { username: string; password: string }>({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    verifyUser: builder.query<any, string>({
      query: (token) => `users/verify/${token}`,
    }),

    forgotPassword: builder.mutation<any, { email: string }>({
      query: (payload) => ({
        url: 'users/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),

    resetPassword: builder.mutation<any, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `users/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),

    updateUserInfo: builder.mutation<any, { id: string; data: Record<string, any> }>({
      query: ({ id, data }) => ({
        url: `users/update-info/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteUserProfileImage: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/users/${id}/image`,
        method: 'DELETE',
      }),
    }),

    banAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/ban-account/${id}`,
        method: 'PUT',
      }),
    }),

    unbanAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/unban-account/${id}`,
        method: 'PUT',
      }),
    }),

    updatePassword: builder.mutation<any, { id: string; password: string }>({
      query: ({ id, password }) => ({
        url: `users/update-password/${id}`,
        method: 'PUT',
        body: { password },
      }),
    }),

    getWishlist: builder.query<WishlistItem[], void>({
      query: () => 'users/me/wishlist',
      providesTags: ['Wishlist'],
    }),

    addToWishlist: builder.mutation<WishlistItem, { gameId: string }>({
      query: (payload) => ({
        url: 'users/me/wishlist',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Wishlist'],
    }),

    removeFromWishlist: builder.mutation<void, string>({
      query: (gameId) => ({
        url: `users/me/wishlist/${gameId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),

    getBasket: builder.query<BasketItem[], void>({
      query: () => 'users/me/basket',
      providesTags: ['Basket'],
    }),

    addToBasket: builder.mutation<BasketItem, { gameId: string }>({
      query: (payload) => ({
        url: 'users/me/basket',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Basket']
    }),

    removeFromBasket: builder.mutation<any, string>({
      query: (gameId) => ({
        url: `users/me/basket/${gameId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Basket'],
    }),

    clearBasket: builder.mutation<any, void>({
      query: () => ({
        url: 'users/me/basket',
        method: 'DELETE',
      }),
      invalidatesTags: ['Basket'],
    }),

    subscribe: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: 'users/subscribe',
        method: 'POST',
        body: payload,
      }),
    }),

    topUp: builder.mutation<any, { amount: number }>({
      query: (payload) => ({
        url: 'users/payments/top-up',
        method: 'POST',
        body: payload,
      }),
    }),

    redeemCoupon: builder.mutation<any, { coupon: string }>({
      query: (payload) => ({
        url: 'users/coupons/redeem',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByUsernameQuery,
  useGetUserByIdQuery,
  useRegisterUserMutation,
  useRegisterDeveloperMutation,
  useLoginUserMutation,
  useVerifyUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserInfoMutation,
  useDeleteUserProfileImageMutation,
  useBanAccountMutation,
  useUnbanAccountMutation,
  useUpdatePasswordMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetBasketQuery,
  useAddToBasketMutation,
  useRemoveFromBasketMutation,
  useClearBasketMutation,
  useSubscribeMutation,
  useTopUpMutation,
  useRedeemCouponMutation,
} = userApi;
