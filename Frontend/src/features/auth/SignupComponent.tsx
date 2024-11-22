import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TbLock, TbUser } from "react-icons/tb";
import ExtendFormRow from "../../components/ExtendFormRow";
import Logo from "../../components/Logo";
import LanguageSelector from "../../i18n/LanguageSelector";
import { useRegisterMutation } from "../../services/redux/api/authApi";
import { SignUpData } from "./auth";

function SignupComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState, reset, watch } =
    useForm<SignUpData>();
  const { errors } = formState;
  const [signup, isLoading] = useRegisterMutation();
  const handleShowClick = () => setShowPassword(!showPassword);

  function handleSignup(data: SignUpData) {
    signup(data);
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
              error={errors.password}
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
              error={errors.password}
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
              isDisabled={!formState.isValid || isLoading}
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
