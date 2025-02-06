import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      let token = (getState() as any).auth?.token;
      if (!token) {
        token = Cookies.get('token');
      }
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // GET /api/users - Retrieves all users (Protected; requires role admin or user)
    getUsers: builder.query<any, void>({
      query: () => 'users',
    }),

    // GET /api/users/:id - Retrieves details of a single user by ID (Protected by token verification)
    getUserById: builder.query<any, string>({
      query: (id) => `users/${id}`,
    }),

    // POST /api/users/register - Registers a new user account.
    registerUser: builder.mutation<any, Record<string, any>>({
      query: (userData) => ({
        url: 'users/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // POST /api/users/dev/register - Registers a new developer account.
    registerDeveloper: builder.mutation<any, Record<string, any>>({
      query: (devData) => ({
        url: 'users/dev/register',
        method: 'POST',
        body: devData,
      }),
    }),

    // POST /api/users/login - Logs in a user.
    loginUser: builder.mutation<any, { username: string; password: string }>({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // GET /api/users/verify/:token - Verifies a user's account using a token.
    verifyUser: builder.query<any, string>({
      query: (token) => `users/verify/${token}`,
    }),

    // POST /api/users/forgot-password - Initiates the forgot password process.
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (payload) => ({
        url: 'users/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),

    // POST /api/users/reset-password/:token - Resets the user's password using a token (Protected by token verification)
    resetPassword: builder.mutation<any, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `users/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),

    // PUT /api/users/update-info/:id - Updates user information (Protected by token verification)
    updateUserInfo: builder.mutation<any, { id: string; data: Record<string, any> }>({
      query: ({ id, data }) => ({
        url: `users/update-info/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE /api/users/users/:id/image - Deletes a user's profile image.
    deleteUserProfileImage: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/users/${id}/image`,
        method: 'DELETE',
      }),
    }),

    // PUT /api/users/ban-account/:id - Bans a user account (Protected; requires role admin)
    banAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/ban-account/${id}`,
        method: 'PUT',
      }),
    }),

    // PUT /api/users/unban-account/:id - Unbans a user account (Protected; requires role admin)
    unbanAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `users/unban-account/${id}`,
        method: 'PUT',
      }),
    }),

    // PUT /api/users/update-password/:id - Updates the user's password (Protected by token verification)
    updatePassword: builder.mutation<any, { id: string; password: string }>({
      query: ({ id, password }) => ({
        url: `users/update-password/${id}`,
        method: 'PUT',
        body: { password },
      }),
    }),

    // GET /api/users/me/wishlist - Retrieves the current user’s wishlist (Protected by auth middleware)
    getWishlist: builder.query<any, void>({
      query: () => 'users/me/wishlist',
    }),

    // POST /api/users/me/wishlist - Adds an item to the current user’s wishlist (Protected by auth middleware)
    addToWishlist: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: 'users/me/wishlist',
        method: 'POST',
        body: payload,
      }),
    }),

    // DELETE /api/users/me/wishlist/:gameId - Removes an item from the current user’s wishlist (Protected by auth middleware)
    removeFromWishlist: builder.mutation<any, string>({
      query: (gameId) => ({
        url: `users/me/wishlist/${gameId}`,
        method: 'DELETE',
      }),
    }),

    // GET /api/users/me/basket - Retrieves the current user’s basket (Protected by auth middleware)
    getBasket: builder.query<any, void>({
      query: () => 'users/me/basket',
    }),

    // POST /api/users/me/basket - Adds an item to the current user’s basket (Protected by auth middleware)
    addToBasket: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: 'users/me/basket',
        method: 'POST',
        body: payload,
      }),
    }),

    // DELETE /api/users/me/basket/:gameId - Removes an item from the current user’s basket (Protected by auth middleware)
    removeFromBasket: builder.mutation<any, string>({
      query: (gameId) => ({
        url: `users/me/basket/${gameId}`,
        method: 'DELETE',
      }),
    }),

    // DELETE /api/users/me/basket - Clears the current user’s basket (Protected by auth middleware)
    clearBasket: builder.mutation<any, void>({
      query: () => ({
        url: 'users/me/basket',
        method: 'DELETE',
      }),
    }),

    // POST /api/users/subscribe - Subscribes the current user to a service (Protected by auth middleware)
    subscribe: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: 'users/subscribe',
        method: 'POST',
        body: payload,
      }),
    }),

    // POST /api/users/payments/top-up - Tops up the user's balance (Protected by auth middleware)
    topUp: builder.mutation<any, { amount: number }>({
      query: (payload) => ({
        url: 'users/payments/top-up',
        method: 'POST',
        body: payload,
      }),
    }),

    // POST /api/users/coupons/redeem - Redeems a coupon for the user (Protected by auth middleware)
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
