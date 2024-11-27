import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Link,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TbLock, TbUser } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import ExtendFormRow from "../../components/ExtendFormRow";
import Logo from "../../components/Logo";
import LanguageSelector from "../../i18n/LanguageSelector";
import { useLoginMutation } from "../../services/redux/api/apiAuth";
import { useAuth } from "../../services/redux/slices/authStore";
import { LoginCredentials } from "./auth";
import ShowPasswordToggleButton from "./ShowPasswordToggleButton";

function LoginComponent() {
  const loginAction = useAuth((state) => state.login);
  //   const isAlreadyAuthenticated = useAuth((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const { register, handleSubmit, formState, reset, watch } =
    useForm<LoginCredentials>();
  const [showPassword, setShowPassword] = useState(false);
  const { errors } = formState;
  const isAllFieldsFilled =
    watch("username")?.length > 0 && watch("password")?.length > 0;
  const { t } = useTranslation("auth", { keyPrefix: "login" });
  const [login, isLoading] = useLoginMutation({
    onSuccess: (_, user) => {
      loginAction(user);
      navigate("/");
    },
  });
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
              autoComplete='username'
              error={errors.username}
              withoutLabel
              inputStyle={{ height: "3rem", padding: "0 25px" }}
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
                autoComplete='current-password'
                error={errors.password}
                variant='outline'
                withoutLabel
                inputStyle={{ height: "3rem" }}
                rightInnerProps={{
                  width: "4.5rem",
                  height: "3rem",
                  children: (
                    <ShowPasswordToggleButton
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
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
              <FormHelperText
                textAlign='end'
                fontSize={"1.1rem"}
                color={"teal.500"}
              >
                <Link>{t("forgot-password")}</Link>
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
              {t("login")}
            </Button>
          </Stack>
        </Box>
      </Stack>
      <Box>
        {t("new-employee")}
        {"? "}
        <Link color='teal.500' href='/signup'>
          {t("signup")}
        </Link>
      </Box>
    </Flex>
  );
}

export default LoginComponent;
