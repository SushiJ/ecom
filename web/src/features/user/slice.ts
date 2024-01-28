import {
  LoginData,
  Register,
  LoginMutationResponse,
} from "../../types/user.ts";
import { api } from "../api.ts";

export const userApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginMutationResponse, LoginData>({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<void, Register>({
      query: (data) => ({
        url: "users",
        method: "POST",
        body: data,
      }),
      // TODO: Error response types

      // transformErrorResponse: (response: Error) =>
      //   response.error,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: "users/profile",
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => "users",
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `users/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `users/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useLogoutMutation,
  useProfileMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useDeleteUserMutation,
} = userApiSlice;
