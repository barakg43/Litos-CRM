import {
  Box,
  LayoutProps,
  Stack,
  StackDirection,
  SystemStyleObject,
  Text,
  UseRadioGroupProps,
  UseRadioProps,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CustomRadioGroupProps extends UseRadioGroupProps {
  options: Option[];
  defaultValue: string;
  direction?: StackDirection | undefined;
  buttonWidth?: React.PropsWithoutRef<LayoutProps["width"]>;
  label?: string | undefined;
  register?: UseFormRegisterReturn<string> | undefined;
  sx?: SystemStyleObject | undefined;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  options,
  defaultValue,
  onChange,
  buttonWidth,
  label,
  register,
  direction = "row",
  sx,
  ...props
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue,
    ...props,
  });

  const group = getRootProps();

  return (
    <Stack {...group} direction={direction} height={"100%"} sx={sx}>
      {label && (
        <Text textAlign='center' alignContent='center' fontWeight='bold'>
          {label}
        </Text>
      )}
      {options.map((option) => (
        <RadioCard
          key={option.value}
          {...getRadioProps({
            value: option.value,
            width: buttonWidth,
            register,
          })}
          onValueChange={onChange}
        >
          {option.label}
        </RadioCard>
      ))}
    </Stack>
  );
};

interface Option {
  label: string;
  value: string;
}

type RadioButtonProps = UseRadioProps & {
  label?: string;
  width?: React.PropsWithoutRef<LayoutProps["width"]>;
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
  register?: UseFormRegisterReturn<string> | undefined;
};
function RadioCard(props: RadioButtonProps) {
  const {
    register = { onChange: () => {} },
    onValueChange,
    ...radioProps
  } = props;
  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(radioProps);
  const { onChange: registerOnChange, ...registerProps } = register;
  const { onChange: inputOnChange, ...inputProps } = getInputProps();
  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    inputOnChange?.(event);
    registerOnChange(event);
    onValueChange?.(event.target?.value);
  }
  return (
    <Box cursor='pointer' textAlign='center' as='label' {...htmlProps}>
      <input
        {...inputProps}
        {...registerProps}
        onChange={changeHandler}
        hidden
      />
      <Box
        {...getRadioProps()}
        bg={state.isChecked ? "teal.200" : "transparent"}
        p={1}
        rounded='full'
        borderWidth='2px'
        boxShadow='md'
      >
        <Text
          textAlign='center'
          fontWeight={state.isChecked ? "bold" : "normal"}
          {...getLabelProps()}
        >
          {props.children}
        </Text>
      </Box>
    </Box>
  );
}
export default CustomRadioGroup;
