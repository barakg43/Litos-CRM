import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  IconButton,
  Link,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TbEye, TbEyeOff, TbLock, TbUser } from "react-icons/tb";
import ExtendFormRow from "../../components/ExtendFormRow";
import Logo from "../../components/Logo";
import LanguageSelector from "../../i18n/LanguageSelector";
import { useLoginMutation } from "../../services/redux/api/authApi";
import { LoginCredentials } from "./auth";

function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState, reset, watch } =
    useForm<LoginCredentials>();
  const { errors } = formState;
  console.log("watch", watch());
  const isAllFieldsFilled =
    watch("username")?.length > 0 && watch("password")?.length > 0;

  const handleShowClick = () => setShowPassword(!showPassword);
  const [login, isLoading] = useLoginMutation();
  function handleLogin(credentials: LoginCredentials) {
    console.log("credentials", credentials);

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
      <LanguageSelector
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
      />
      <Stack
        flexDir='column'
        mb='2'
        justifyContent='center'
        alignItems='center'
      >
        <Flex justifyContent='center' alignItems='center' h='15rem'>
          <Logo />
        </Flex>
        <Box as='form' onSubmit={handleSubmit(handleLogin)}>
          <Stack
            spacing={4}
            p='1rem'
            backgroundColor='whiteAlpha.900'
            boxShadow='md'
            width={"30rem"}
            alignItems='center'
            borderRadius={"1rem"}
          >
            <ExtendFormRow
              registerFn={register}
              fieldName='username'
              translationNS='auth'
              keyPrefix='login'
              type='text'
              variant='outline'
              error={errors.username}
              withoutLabel
              inputStyle={{ height: "3rem" }}
              inputGroupProps={{ width: "20rem", height: "3rem" }}
              leftInnerProps={{
                pointerEvents: "none",
                color: "gray.700",
                children: <TbUser />,
                height: "3rem",
                alignContent: "center",
                textAlign: "center",
              }}
            />
            <FormControl width={"20rem"}>
              <ExtendFormRow
                type={showPassword ? "text" : "password"}
                fieldName='password'
                registerFn={register}
                translationNS='auth'
                keyPrefix='login'
                error={errors.password}
                variant='outline'
                withoutLabel
                inputStyle={{ height: "3rem" }}
                rightInnerProps={{
                  width: "4.5rem",
                  height: "3rem",
                  children: (
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
                  ),
                }}
                leftInnerProps={{
                  pointerEvents: "none",
                  color: "gray.700",
                  children: <TbLock />,
                  height: "3rem",
                  alignContent: "center",
                  textAlign: "center",
                }}
              />
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
              isDisabled={!formState.isValid || isLoading || !isAllFieldsFilled}
              width={"20rem"}
            >
              Login
            </Button>
          </Stack>
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
