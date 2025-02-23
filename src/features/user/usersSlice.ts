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

interface UserBalance {
  balance: number;
}

interface AddToLibraryResponse {
  message: string;
}

interface DeductBalanceRequest {
  amount: number;
}

interface AddToLibraryRequest {
  gameId: string;
}

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
      query: (username) => `users/username/${username}`,
      providesTags: (result, error, username) => [{ type: 'User', username }],
    }),

    getUserById: builder.query<any, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    getUserBalance: builder.query<UserBalance, void>({
      query: () => 'users/balance/get',
      providesTags: ['User'],
    }),

    deductBalance: builder.mutation<UserBalance, DeductBalanceRequest>({
      query: (body) => ({
        url: 'users/deduct-balance',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    addToLibrary: builder.mutation<AddToLibraryResponse, AddToLibraryRequest>({
      query: (body) => ({
        url: 'users/library',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
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
      invalidatesTags: ['User'],
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
      invalidatesTags: ['User'],
    }),

    resetPassword: builder.mutation<any, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `users/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
      invalidatesTags: ['User'],
    }),

    updateUserInfo: builder.mutation<any, { id: string; data: Record<string, any> }>({
      query: ({ id, data }) => ({
        url: `users/update-info/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUserProfileImage: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/users/${id}/image`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    banAccount: builder.mutation({
      query: ({ id, duration }) => ({
        url: `users/ban-account/${id}`,
        method: "PUT",
        body: { duration },
      }),
      invalidatesTags: ['User'],
    }),

    unbanAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/unban-account/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),

    updatePassword: builder.mutation<any, { oldPassword: string, password: string, confirmPassword: string }>({
      query: ({ oldPassword, password, confirmPassword }) => ({
        url: `users/update-password`,
        method: 'PUT',
        body: { oldPassword, password, confirmPassword },
      }),
      invalidatesTags: ['User'],
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
    approveDeveloper: builder.mutation({
      query: (id) => ({
        url: `users/approve/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ['User'],
    }),
    requestTopup: builder.mutation({
      query: (body) => ({
        url: 'users/topup/request',
        method: 'POST',
        body,
      }),
    }),
    verifyTopup: builder.mutation({
      query: (body) => ({
        url: 'users/topup/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
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
  useGetUserBalanceQuery,
  useDeductBalanceMutation,
  useAddToLibraryMutation,
  useApproveDeveloperMutation,
  useRequestTopupMutation,
  useVerifyTopupMutation
} = userApi;
