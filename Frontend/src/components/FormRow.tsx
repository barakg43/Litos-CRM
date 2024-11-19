import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SystemStyleObject,
  Textarea,
} from "@chakra-ui/react";
import { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
type FromRowProps = {
  label: string;
  type?: HTMLInputTypeAttribute | undefined;
  register?: UseFormRegisterReturn<string> | undefined;
  isRequired?: boolean;
  error?: string | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  sx?: SystemStyleObject | undefined;
};
function FormRow({
  label,
  defaultValue,
  type = "text",
  register,
  error,
  isRequired = false,
  sx,
}: FromRowProps) {
  return (
    <FormControl
      isRequired={isRequired}
      display='flex'
      alignItems='center'
      isInvalid={error !== undefined}
      sx={sx}
    >
      <FormLabel width='12rem' fontSize='1.25rem' fontWeight={600}>
        {label}
      </FormLabel>

      {ReactComponentInput({ type, label, defaultValue, register })}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
type ChakraInputType<T extends FieldValues> = Pick<
  FromRowProps<T>,
  | "label"
  | "type"
  | "defaultValue"
  | "register"
  | "rightInnerElement"
  | "leftInnerElement"
  | "inputGroupProps"
>;
function ReactComponentInput<T extends FieldValues>({
  type,
  label,
  defaultValue,
  register,
  rightInnerElement,
  leftInnerElement,
  inputGroupProps,
}: ChakraInputType<T>) {
  switch (type) {
    case "checkbox":
      return (
        <Checkbox
          placeholder={label}
          variant='flushed'
          defaultValue={defaultValue || ""}
          fontSize='1.1rem'
          {...register}
        />
      );
    case "textarea":
      if (rightInnerElement || leftInnerElement) {
        return (
          <InputGroup {...inputGroupProps}>
            {rightInnerElement && rightInnerElement()}
            <Textarea
              placeholder={label}
              variant='flushed'
              defaultValue={defaultValue || ""}
              fontSize='1.1rem'
              {...register}
            />
            {leftInnerElement && leftInnerElement()}
          </InputGroup>
        );
      } else
        return (
          <Textarea
            placeholder={label}
            variant='flushed'
            defaultValue={defaultValue || ""}
            fontSize='1.1rem'
            {...register}
          />
        );
    default:
      if (rightInnerElement || leftInnerElement) {
        return (
          <InputGroup {...inputGroupProps}>
            {rightInnerElement && rightInnerElement()}
            <Input
              type={type}
              defaultValue={defaultValue || ""}
              placeholder={label}
              variant='flushed'
              fontSize='1.1rem'
              {...register}
            />
            {leftInnerElement && leftInnerElement()}
          </InputGroup>
        );
      } else
        return (
          <Input
            type={type}
            defaultValue={defaultValue || ""}
            placeholder={label}
            variant='flushed'
            fontSize='1.1rem'
            {...register}
          />
        );
  }
}
export default FormRow;
