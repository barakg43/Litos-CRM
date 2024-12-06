import { Box, Container, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

function AppLayout() {
  return (
    <Flex h='100vh' w='100dvw'>
      <SideBar />
      <Flex flexDir='column' grow={1}>
        <TopHeader />
        <Box
          as='main'
          paddingTop='2rem'
          height='100vh'
          overflowY='scroll'
          bg='var(--color-primary-100)'
        >
          <Container centerContent display='flex' minH='100%' minW='100%'>
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
}
export default AppLayout;
