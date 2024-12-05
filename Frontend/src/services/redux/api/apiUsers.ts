import { UserSecurityUpdateRequest } from "../../../features/users/users";
import { baseApi } from "../baseApi";

const usersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    usersList: builder.query({
      query: () => "/users",
      providesQueryKeys: () => ["Users"],
    }),
    updateUserSecurityProps: builder.mutation<void, UserSecurityUpdateRequest>({
      query: (data) => ({
        url: "/users/update-security-props",
        method: "PATCH",
        body: data,
      }),
      invalidatesKeys: () => ["User"],
    }),
  }),
});

const { useUsersListQuery, useUpdateUserSecurityPropsMutation } = usersApiSlice;
