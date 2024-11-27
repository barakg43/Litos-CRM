import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z, ZodType } from "zod";
import ExtendFormRow from "../../components/ExtendFormRow";
import Logo from "../../components/Logo";
import LanguageSelector from "../../i18n/LanguageSelector";
import { useRegisterMutation } from "../../services/redux/api/apiAuth";
import { SignUpData } from "./auth";

import { useNavigate } from "react-router-dom";
import ShowPasswordToggleButton from "./ShowPasswordToggleButton";
const SignupSchema: ZodType<SignUpData> = z
  .object({
    email: z.string().email(),
    username: z
      .string()
      .min(3, { message: "Username is too short" })
      .max(40, { message: "Username is too long" }),
    fullName: z.string().min(3, { message: "Full name is too short" }),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(50, { message: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });

function SignupComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState, reset, watch } =
    useForm<SignUpData>({ resolver: zodResolver(SignupSchema) });
  const navigate = useNavigate();
  const { errors } = formState;
  const [signup, isLoading] = useRegisterMutation({
    onSuccess: () => navigate("/login"),
  });
  const { t } = useTranslation("auth", { keyPrefix: "signup" });
  function handleSignup(data: SignUpData) {
    const filteredData = {
      password: data.password,
      username: data.username,
      fullName: data.fullName,
      email: data.email,
    };
    signup(filteredData);
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
        <Box as='form' onSubmit={handleSubmit(handleSignup)}>
          <Stack
            spacing={4}
            p='1rem'
            backgroundColor='
            whiteAlpha.900'
            boxShadow='md'
            width={"30rem"}
            alignItems='center'
            borderRadius={"1rem"}
          >
            <ExtendFormRow
              registerFn={register}
              fieldName='fullName'
              translationNS='auth'
              keyPrefix='signup'
              type='text'
              variant='outline'
              error={errors.fullName}
              inputStyle={{ height: "3rem" }}
            />
            <ExtendFormRow
              registerFn={register}
              fieldName='username'
              translationNS='auth'
              keyPrefix='signup'
              type='text'
              variant='outline'
              error={errors.username}
              autoComplete='username'
              //   withoutLabel
              inputStyle={{ height: "3rem" }}
              inputGroupProps={{ width: "20rem", height: "3rem" }}
              //   leftInnerProps={{
              //     pointerEvents: "none",
              //     color: "gray.700",
              //     children: <TbUser />,
              //     height: "3rem",
              //     alignContent: "center",
              //     textAlign: "center",
              //   }}
            />
            <ExtendFormRow
              type={showPassword ? "text" : "password"}
              fieldName='password'
              registerFn={register}
              translationNS='auth'
              keyPrefix='signup'
              error={errors.password}
              autoComplete='new-password'
              variant='outline'
              //   withoutLabel
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
              //   leftInnerProps={{
              //     pointerEvents: "none",
              //     color: "gray.700",
              //     children: <TbLock />,
              //     height: "3rem",
              //     alignContent: "center",
              //     textAlign: "center",
              //   }}
            />
            <ExtendFormRow
              type={showPassword ? "text" : "password"}
              fieldName='confirmPassword'
              registerFn={register}
              translationNS='auth'
              keyPrefix='signup'
              error={errors.confirmPassword}
              autoComplete='new-password'
              variant='outline'
              //   withoutLabel
              inputStyle={{ height: "3rem" }}
              //   leftInnerProps={{
              //     pointerEvents: "none",
              //     color: "gray.700",
              //     children: <TbLock />,
              //     height: "3rem",
              //     alignContent: "center",
              //     textAlign: "center",
              //   }}
            />

            <ExtendFormRow
              type='email'
              fieldName='email'
              registerFn={register}
              translationNS='auth'
              keyPrefix='signup'
              error={errors.email}
              variant='outline'
              //   withoutLabel
              inputStyle={{ height: "3rem" }}
              //   leftInnerProps={{
              //     pointerEvents: "none",
              //     color: "gray.700",
              //     children: <TbLock />,
              //     height: "3rem",
              //     alignContent: "center",
              //     textAlign: "center",
              //   }}
            />
            <Button
              borderRadius={3}
              type='submit'
              variant='solid'
              fontSize='1.3rem'
              colorScheme='teal'
              isLoading={isLoading}
              isDisabled={isLoading}
              width={"20rem"}
            >
              {t("register")}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default SignupComponent;
