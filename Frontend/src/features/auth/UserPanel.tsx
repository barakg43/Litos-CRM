import { Avatar, Flex, IconButton, Text } from "@chakra-ui/react";
import { TbLogout, TbUserCircle } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../services/redux/api/apiAuth";
import { useAuth } from "../../services/redux/slices/authStore";

function UserPanel() {
  const fullName = useAuth((state) => state.user?.fullName);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation({ onSuccess: () => navigate("/login") });

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
