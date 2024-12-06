import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CustomTable from "../../components/CustomTable";
import { useUsersListQuery } from "../../services/redux/api/apiUsers";
import { useAuthStore } from "../../services/redux/slices/useAuthStore";
import UserRow from "./UserRow";
import { UserSecurity } from "./users";
export const roles = ["ADMIN", "USER"] as const;
function UserTable() {
  const { data: users, isLoading } = useUsersListQuery();
  const { t } = useTranslation("users", { keyPrefix: "table" });
  const currentUsername = useAuthStore((state) => state.user?.username);
  const filterOutCurrentUser = users?.filter(
    (user) => user.username != currentUsername
  );
  return (
    <Flex
      direction='row'
      width='fit-content'
      height='max-content'
      alignItems='center'
      position={"absolute"}
      top={"15rem"}
    >
      <CustomTable columns={"1fr ".repeat(6)}>
        <CustomTable.TranslateLabelsHeader
          t={t}
          labels={["username", "fullName", "createdAt", "role", "enabled"]}
        />
        <CustomTable.Body
          data={filterOutCurrentUser}
          resourceName={t("title")}
          isLoading={isLoading}
          render={({
            username,
            createdAt,
            enabled,
            role,
            fullName,
          }: UserSecurity) => (
            <UserRow
              username={username}
              fullName={fullName}
              createdAt={createdAt}
              enabled={enabled}
              role={role}
              key={username}
            />
          )}
        />

        {/* <CustomTable.Footer>
          <Pagination as='td' totalItemsAmount={totalItems} />
        </CustomTable.Footer> */}
      </CustomTable>
    </Flex>
  );
}

export default UserTable;
