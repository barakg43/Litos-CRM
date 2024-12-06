import { VStack } from "@chakra-ui/react";
import Logo from "./Logo";
import MainNav from "./MainNav";

function Sidebar() {
  return (
    <VStack
      justifyContent='flex-start'
      gap='5rem'
      as='nav'
      borderInlineEnd={"2px solid var(--color-primary-300)"}
      boxShadow='dark-lg'
      // alignContent='start'
    >
      <Logo />
      <MainNav />
    </VStack>
  );
}

export default Sidebar;
