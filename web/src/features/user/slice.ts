import {
  LoginData,
  Register,
  LoginMutationResponse,
  GetUsersResponse,
  GetUsersByIdResponse,
  UpdateUserInfoMutation,
} from "../../types/user.ts";
import { api } from "../api.ts";

export const userApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginMutationResponse, LoginData>({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
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
    getUsers: builder.query<GetUsersResponse, void>({
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
    getUserDetails: builder.query<GetUsersByIdResponse, string>({
      query: (id) => ({
        url: `users/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation<unknown, UpdateUserInfoMutation>({
      query: (data) => ({
        url: `users/${data.id}`,
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
