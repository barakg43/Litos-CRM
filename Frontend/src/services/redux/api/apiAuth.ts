import { LoginCredentials, UserDetails } from "../../../features/auth/auth";
import { baseApi } from "../baseApi";

const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query<UserDetails, void>({
      query: () => "/users/me",
      providesQueryKeys: () => ["User"],
    }),

    login: builder.mutation<UserDetails, LoginCredentials>({
      query: ({ username, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { username, password },
      }),
    }),

    register: builder.mutation({
      query: ({ username, fullName, email, password }) => ({
        url: "/auth/signup",
        method: "POST",
        body: { username, fullName, email, password },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    // activation: builder.mutation({
    //   query: ({ uid, token }) => ({
    //     url: "/users/activation/",
    //     method: "POST",
    //     body: { uid, token },
    //   }),
    // }),
    // resetPassword: builder.mutation({
    //   query: (email) => ({
    //     url: "/users/reset_password/",
    //     method: "POST",
    //     body: { email },
    //   }),
    // }),
    // resetPasswordConfirm: builder.mutation({
    //   query: ({ uid, token, new_password, re_new_password }) => ({
    //     url: "/users/reset_password_confirm/",
    //     method: "POST",
    //     body: { uid, token, new_password, re_new_password },
    //   }),
    // }),
  }),
});

export const {
  useRetrieveUserQuery,
  useLoginMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useLogoutMutation,

  //   useSocialAuthenticateMutation,
  //   useRegisterMutation,
  //   useActivationMutation,
  //   useResetPasswordMutation,
  //   useResetPasswordConfirmMutation,
} = authApiSlice;
