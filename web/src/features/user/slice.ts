import { api } from "../api.ts";

type LoginData = {
  password: string;
  email: string;
};

type Register = LoginData & {
  name: string;
};

export const userApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data: LoginData) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data: Register) => ({
        url: "users",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
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
