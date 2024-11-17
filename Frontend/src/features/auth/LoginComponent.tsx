import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
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
        <Avatar bg='teal.500' />
        <Heading color='teal.400'>Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit(handleLogin)}>
            <Stack
              spacing={4}
              p='1rem'
              backgroundColor='whiteAlpha.900'
              boxShadow='md'
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents='none'
                    children={<TbUser color='gray.300' />}
                  />
                  <Input type='email' placeholder='email address' />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    children={<TbLock color='gray.300' />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder='Password'
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign='right'>
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type='submit'
                variant='solid'
                colorScheme='teal'
                width='full'
                isLoading={isLoading}
                disabled={!formState.isValid || isLoading}
              >
                Login
              </Button>
            </Stack>
          </form>
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
