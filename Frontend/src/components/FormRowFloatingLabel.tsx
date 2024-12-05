import {
  Checkbox,
  ComponentWithAs,
  defineStyle,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputLeftElementProps,
  InputRightElement,
  InputRightElementProps,
  keyframes,
  SystemStyleObject,
  Textarea,
} from "@chakra-ui/react";
import { HTMLInputTypeAttribute } from "react";
import {
  FieldError,
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";
import { isRtlLang } from "../i18n/i18n";

export type FromRowProps<T extends FieldValues> = {
  label: string;
  type?: HTMLInputTypeAttribute | undefined;
  register: UseFormRegisterReturn<FieldPath<T>>;
  isRequired?: boolean;
  error?: FieldError;
  defaultValue?: string | number | readonly string[] | undefined;
  sx?: SystemStyleObject | undefined;
  rightInnerProps?: InputRightElementProps;
  leftInnerProps?: InputLeftElementProps;
  inputGroupProps?: InputGroupProps;
  inputStyle?: SystemStyleObject | undefined;
  autoComplete?: string;
  withoutLabel?: boolean;
  variant?: "outline" | "filled" | "flushed" | "unstyled";
};
export type InputLeftElementType = ComponentWithAs<
  "div",
  InputLeftElementProps
>;
export type InputRightElementType = ComponentWithAs<
  "div",
  InputRightElementProps
>;
function FormRow<T extends FieldValues>({
  label,
  defaultValue,
  type = "text",
  register,
  error,
  isRequired = false,
  sx,
  withoutLabel = false,
  inputGroupProps,
  leftInnerProps,
  inputStyle,
  rightInnerProps,
  variant,
}: FromRowProps<T>) {
  return (
    <FormControl
      isRequired={isRequired}
      display='flex'
      alignItems='center'
      justifyContent={"center"}
      alignContent={"center"}
      isInvalid={error !== undefined}
      sx={sx}
    >
      {!withoutLabel && (
        <FormLabel
          _peerFocus={{
            color: "#6200ee",
            top: "0",
            transform: "translateY(-50%) scale(0.9)",
          }}
          _peerPlaceholderShown={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
          minWidth='7rem'
          fontSize='1.25rem'
          fontWeight={600}
          pointerEvents={"none"}
        >
          {label}
        </FormLabel>
      )}

      <Flex flexDirection='column' alignItems='start'>
        {ReactComponentInput({
          type,
          label,
          defaultValue,
          register,
          variant,
          inputGroupProps,
          leftInnerProps,
          rightInnerProps,
          inputStyle,
        })}
        {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </Flex>
    </FormControl>
  );
}
type ChakraInputType<T extends FieldValues> = Pick<
  FromRowProps<T>,
  | "label"
  | "type"
  | "defaultValue"
  | "register"
  | "rightInnerProps"
  | "leftInnerProps"
  | "inputGroupProps"
  | "variant"
  | "inputStyle"
  | "autoComplete"
>;
function ReactComponentInput<T extends FieldValues>({
  type,
  label,
  defaultValue = "",
  register,
  rightInnerProps,
  leftInnerProps,
  inputGroupProps,
  autoComplete,
  inputStyle,
  variant = "flushed",
}: ChakraInputType<T>) {
  const rtlLeftInnerInputProps = isRtlLang() ? rightInnerProps : leftInnerProps;
  const rtlRightInnerInputProps = isRtlLang()
    ? leftInnerProps
    : rightInnerProps;

  switch (type) {
    case "checkbox":
      return (
        <Checkbox
          placeholder={label}
          variant='flushed'
          defaultValue={defaultValue}
          fontSize='1.1rem'
          {...register}
        />
      );
    case "textarea":
      return (
        <InputWithOptionalElement
          inputElement={
            <Textarea
              placeholder={label}
              variant={variant}
              defaultValue={defaultValue}
              fontSize='1.1rem'
              sx={inputStyle}
              autoComplete={autoComplete}
              {...register}
            />
          }
          inputGroupProps={inputGroupProps}
          leftInnerProps={rtlLeftInnerInputProps}
          rightInnerProps={rtlRightInnerInputProps}
        />
      );

    //       <InputGroup {...inputGroupProps}>
    //         {rtlLeftInnerInputProps && (
    //           <InputLeftElement {...rtlLeftInnerInputProps} />
    //         )}

    //         {rtlRightInnerInputProps && (
    //           <InputRightElement {...rtlRightInnerInputProps} />
    //         )}
    //       </InputGroup>
    //     );
    //   } else
    //     return (
    //       <Textarea
    //         placeholder={label}
    //         variant={variant}
    //         defaultValue={defaultValue}
    //         fontSize='1.1rem'
    //         {...register}
    //       />
    //     );
    default:
      return (
        <InputWithOptionalElement
          inputElement={
            <Input
              type={type}
              defaultValue={defaultValue}
              placeholder={label}
              variant={variant}
              fontSize='1.1rem'
              sx={inputStyle}
              autoComplete={autoComplete}
              {...register}
            />
          }
          inputGroupProps={inputGroupProps}
          leftInnerProps={rtlLeftInnerInputProps}
          rightInnerProps={rtlRightInnerInputProps}
        />
      );
  }
}
interface InputWithOptionalElementProps<T extends FieldValues>
  extends Pick<
    ChakraInputType<T>,
    "inputGroupProps" | "leftInnerProps" | "rightInnerProps"
  > {
  inputElement: React.ReactNode;
}
function InputWithOptionalElement<T extends FieldValues>({
  inputElement,
  inputGroupProps,
  leftInnerProps,
  rightInnerProps,
}: InputWithOptionalElementProps<T>) {
  if (rightInnerProps || leftInnerProps) {
    return (
      <InputGroup {...inputGroupProps}>
        {leftInnerProps && <InputLeftElement {...leftInnerProps} />}
        {inputElement}
        {rightInnerProps && <InputRightElement {...rightInnerProps} />}
      </InputGroup>
    );
  } else return inputElement;
}
const floatingStyles = defineStyle({
  pos: "absolute",
  bg: "bg",
  px: "0.5",
  top: "-3",
  insetStart: "2",
  fontWeight: "normal",
  //   pointerEvents: "none",
  transition: "position",
  _peerPlaceholderShown: {
    color: "fg.muted",
    top: "2.5",
    insetStart: "3",
  },
  _peerFocusVisible: {
    color: "fg",
    top: "-3",
    insetStart: "2",
  },
});
export default FormRow;

const inputHighlighter = keyframes`
  from {
    background: #4285f4;
  }
  to {
    width: 0;
    background: transparent;
  }
`;
const FloatingInputGroup = ({
  type,
  label,
}: {
  type: string;
  label: string;
}) => {
  return (
    <FormControl position='relative' my='6'>
      <Input
        type={type}
        required
        fontSize='18px'
        p='10px 10px 10px 5px'
        display='block'
        width='300px'
        border='none'
        borderBottom='1px solid #757575'
        focusBorderColor='transparent'
        _focus={{
          outline: "none",
        }}
      />
      <FormLabel
        color='#999'
        fontSize='18px'
        fontWeight='normal'
        position='absolute'
        left='5px'
        top='10px'
        transition='0.2s ease all'
        _peerFocus={{
          top: "-20px",
          fontSize: "14px",
          color: "#4285f4",
        }}
        _peerPlaceholderShown={{
          top: "10px",
          fontSize: "18px",
          color: "#999",
        }}
      >
        {label}
      </FormLabel>
      <Box
        className='bar'
        position='relative'
        display='block'
        width='315px'
        _before={{
          content: '""',
          height: "2px",
          width: "0",
          bottom: "1px",
          position: "absolute",
          background: "#4285f4",
          left: "50%",
          transition: "0.2s ease all",
        }}
        _after={{
          content: '""',
          height: "2px",
          width: "0",
          bottom: "1px",
          position: "absolute",
          background: "#4285f4",
          right: "50%",
          transition: "0.2s ease all",
        }}
        _peerFocus={{
          _before: { width: "50%" },
          _after: { width: "50%" },
        }}
      />
      <Box
        className='highlight'
        position='absolute'
        height='60%'
        width='100px'
        top='25%'
        left='0'
        pointerEvents='none'
        opacity='0.5'
        animation={`${inputHighlighter} 0.3s ease`}
      />
    </FormControl>
  );
};
const MaterialTextField = () => {
  return (
    <Box
      height='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <FormControl position='relative' width='300px'>
        <Input
          placeholder='placeholder'
          type='text'
          fontSize='1rem'
          outline='none'
          border='1px solid gray'
          borderRadius='5px'
          padding='1rem 0.7rem'
          color='gray'
          _placeholder={{
            opacity: 0,
          }}
          _focus={{
            borderColor: "#6200ee",
          }}
        />
        <FormLabel
          position='absolute'
          fontSize='1rem'
          left='0'
          top='50%'
          transform='translateY(-50%)'
          backgroundColor='white'
          color='gray'
          px='0.3rem'
          mx='0.5rem'
          pointerEvents='none'
          transition='0.1s ease-out'
          transformOrigin='left top'
          _peerFocus={{
            color: "#6200ee",
            top: "0",
            transform: "translateY(-50%) scale(0.9)",
          }}
          _peerPlaceholderShown={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          Label
        </FormLabel>
      </FormControl>
    </Box>
  );
};
