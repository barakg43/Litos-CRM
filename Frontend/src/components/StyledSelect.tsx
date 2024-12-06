import {
  SelectProps as ChakraSelectProps,
  LayoutProps,
  Select,
  forwardRef,
} from "@chakra-ui/react";
import { ChangeEventHandler, Key } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type Option = {
  value: string | number | readonly string[] | undefined;
  label: string | number | undefined;
};

type SelectProps = {
  options: Option[];
  value?: string | number | readonly string[] | undefined;
  onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  props?: ChakraSelectProps;
  register?: UseFormRegisterReturn<string> | undefined;
  width?: React.PropsWithoutRef<LayoutProps["width"]>;
};

const StyledSelect = forwardRef<ChakraSelectProps & SelectProps, "select">(
  ({ options, value, width, register, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
    };
    return (
      <Select
        ref={ref}
        variant='flushed'
        onChange={handleChange}
        defaultValue={value}
        display='flex'
        sx={{ textAlignLast: "center" }}
        width={width}
        {...props}
        {...register}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value as Key}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }
);

export default StyledSelect;
