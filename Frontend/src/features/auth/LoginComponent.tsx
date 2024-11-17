import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TbLock, TbUser } from "react-icons/tb";
import Logo from "../../components/Logo";
import { useLoginMutation } from "../../services/redux/api/authApi";
import { LoginCredentials } from "./auth";

function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState, reset } =
    useForm<LoginCredentials>();
  const handleShowClick = () => setShowPassword(!showPassword);
  const [login, isLoading] = useLoginMutation();
  function handleLogin(credentials: LoginCredentials) {
    login(credentials);
  }

  return (
    <Flex
      flexDirection='column'
      width='100wh'
      height='100vh'
      backgroundColor='gray.200'
      justifyContent='center'
      alignItems='center'
    >
      <Stack
        flexDir='column'
        mb='2'
        justifyContent='center'
        alignItems='center'
      >
        <Flex justifyContent='center' alignItems='center' h='15rem'>
          <Logo />
        </Flex>
        {/* <Avatar bg='teal.500' /> */}
        {/* <Heading color='teal.400'>Welcome</Heading> */}
        <Box as='form' onSubmit={handleSubmit(handleLogin)}>
          {/* <form> */}
          <Stack
            spacing={4}
            p='1rem'
            backgroundColor='whiteAlpha.900'
            boxShadow='md'
            width={"30rem"}
            alignItems='center'
            borderRadius={"1rem"}
          >
            <FormControl
              display='flex'
              justifyContent={"center"}
              alignContent={"center"}
            >
              <InputGroup width='20rem' height='3rem'>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.700'
                  children={<TbUser />}
                  height='3rem'
                />
                <Input
                  type='text'
                  placeholder='Username'
                  height='3rem'
                  fontSize='1.2rem'
                  autoComplete='username'
                  name='username'
                />
              </InputGroup>
            </FormControl>
            <FormControl width={"20rem"}>
              <InputGroup height={"3rem"}>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.700'
                  children={<TbLock />}
                  height={"3rem"}
                  alignContent='center'
                  textAlign='center'
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder='Password'
                  fontSize='1.2rem'
                  height='3rem'
                  autoComplete='password'
                  name='password'
                />
                <InputRightElement width='4.5rem' height='3rem'>
                  <Button h='1.75rem' size='sm' onClick={handleShowClick}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText textAlign='right' fontSize={"1.1rem"}>
                <Link>forgot password?</Link>
              </FormHelperText>
            </FormControl>
            <Button
              borderRadius={3}
              type='submit'
              variant='solid'
              fontSize='1.3rem'
              colorScheme='teal'
              isLoading={isLoading}
              disabled={!formState.isValid || isLoading}
              width={"20rem"}
            >
              Login
            </Button>
          </Stack>
          {/* </form> */}
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color='teal.500' href='#'>
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
}

export default LoginComponent;
