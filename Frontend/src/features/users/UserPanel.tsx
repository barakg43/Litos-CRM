import { Avatar, Flex, IconButton, Text } from "@chakra-ui/react";
import { TbLogout, TbUserCircle } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../services/redux/api/apiAuth";
import { useAuthStore } from "../../services/redux/slices/useAuthStore";

function UserPanel() {
  const fullName = useAuthStore((state) => state.user?.fullName);
  const logoutHandler = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation({
    onSuccess: () => {
      logoutHandler();
      navigate("/login");
    },
  });

  return (
    <Flex alignItems='center' gap={2}>
      <Avatar bg='cyan.500' icon={<TbUserCircle size={20} />} />
      <Text ml={2}>{fullName}</Text>
      <IconButton
        ml={2}
        onClick={() => logout()}
        aria-label='Logout'
        icon={<TbLogout size={20} />}
      />
    </Flex>
  );
}

export default UserPanel;
