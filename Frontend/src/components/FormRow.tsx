import {
  Checkbox,
  ComponentWithAs,
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
        <FormLabel width='12rem' fontSize='1.25rem' fontWeight={600}>
          {label}
        </FormLabel>
      )}

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
export default FormRow;
