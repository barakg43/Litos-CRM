import { SystemStyleObject } from "@chakra-ui/react";
import { TFunction } from "i18next";
import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import ExtendFormRow from "../../components/ExtendFormRow";
import { RenewServiceContract } from "./serviceRenews";

type ServiceFormRowProps = {
  maxLength?: number | undefined;
  t?: TFunction<string, string>;
  register: UseFormRegister<RenewServiceContract>;
  type?: HTMLInputTypeAttribute | undefined;
  isRequired?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  error?: FieldError | undefined;
  label: keyof RenewServiceContract;
  sx?: SystemStyleObject | undefined;
};
function ServiceFormRow({
  maxLength,
  label,
  error,
  defaultValue,
  isRequired,
  register,
  type,
  sx,
}: ServiceFormRowProps) {
  return (
    <ExtendFormRow
      fieldName={label}
      registerFn={register}
      translationNS='serviceRenews'
      error={error}
      defaultValue={defaultValue}
      maxLength={maxLength}
      type={type}
      isRequired={isRequired}
      sx={sx}
    />
  );
}

export default ServiceFormRow;
