import { IconButton } from "@chakra-ui/react";
import { TbEye, TbEyeOff } from "react-icons/tb";

function ShowPasswordToggleButton({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleShowClick = () =>
    setShowPassword((showPassword) => !showPassword);
  return (
    <IconButton
      background={"transparent"}
      border={"none"}
      width='fit-content'
      height='fit-content'
      _focus={{
        outline: "none",
        boxShadow: "none",
        background: "transparent",
      }}
      borderRadius={"full"}
      onClick={handleShowClick}
      aria-label='Toggle password visibility'
      _hover={{ opacity: 0.6 }}
    >
      {showPassword ? (
        <TbEyeOff size={"1.3rem"} aria-label='Hide password' />
      ) : (
        <TbEye size={"1.3rem"} aria-label='Show password' />
      )}
    </IconButton>
  );
}
export default ShowPasswordToggleButton;
