import { Button, Switch } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSave } from "react-icons/fi";
import Table from "../../components/CustomTable";
import StyledSelect, { Option } from "../../components/StyledSelect";
import { isRtlLang } from "../../i18n/i18n";
import { useUpdateUserSecurityPropsMutation } from "../../services/redux/api/apiUsers";
import { Role, UserSecurity } from "./users";
import { roles } from "./UserTable";

function UserRow({
  username,
  fullName,
  createdAt,
  enabled,
  role,
}: UserSecurity) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [userRole, setUserRole] = useState(role);
  const [updateUser, isLoading] = useUpdateUserSecurityPropsMutation();
  function handleUpdateUser() {
    updateUser({ username, role: userRole, enabled: isEnabled });
  }
  const { t } = useTranslation("users", { keyPrefix: "table" });
  const isRTL = isRtlLang();
  const saveIcon = <FiSave size={"1.5rem"} />;
  return (
    <Table.Row height='5rem'>
      <Table.Row.Cell sx={{ textAlign: "center" }}>{username} </Table.Row.Cell>
      <Table.Row.Cell>{fullName} </Table.Row.Cell>
      <Table.Row.Cell sx={{ width: "15rem" }}>
        {new Date(createdAt).toLocaleDateString("en-GB")}
      </Table.Row.Cell>
      <Table.Row.Cell>
        <RoleSelector
          roles={roles}
          onChange={setUserRole}
          defaultValue={role}
        />
      </Table.Row.Cell>
      <Table.Row.Cell
        sx={{
          alignContent: "center",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Switch
          isChecked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
      </Table.Row.Cell>
      <Table.Row.Cell>
        <Button
          onClick={handleUpdateUser}
          disabled={isLoading}
          leftIcon={isRTL ? saveIcon : undefined}
          rightIcon={isRTL ? undefined : saveIcon}
          _hover={{ opacity: 0.7, backgroundColor: "teal.100" }}
          fontSize={"1.2rem"}
          _focus={{ outline: "none" }}
          backgroundColor='teal.200'
        >
          {t("save-button")}
        </Button>
      </Table.Row.Cell>
    </Table.Row>
  );
}

function RoleSelector({
  roles,
  onChange,
  defaultValue,
}: {
  roles: readonly string[];
  onChange: (role: Role) => void;
  defaultValue: string;
}) {
  const { t } = useTranslation("users", { keyPrefix: "roles" });
  const roleOptions: Option[] = roles.map((role) => ({
    label: t(role),
    value: role,
  }));

  return (
    <StyledSelect
      value={defaultValue}
      options={roleOptions}
      onChange={(e) => onChange(e.target.value as Role)}
    />
  );
}
export default UserRow;
