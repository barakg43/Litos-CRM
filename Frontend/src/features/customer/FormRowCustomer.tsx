import { TFunction } from "i18next";
import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import ExtendFormRow from "../../components/ExtendFormRow.tsx";
import { CustomerFullDataType } from "../customers/customers";

type FormRowCustomerProps = {
  maxLength?: number | undefined;
  t?: TFunction<string, string>;
  register: UseFormRegister<CustomerFullDataType>;
  type?: HTMLInputTypeAttribute | undefined;
  isRequired?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  error?: FieldError | undefined;
  label: keyof CustomerFullDataType;
};
function FormRowCustomer({
  maxLength,
  label,
  error,
  defaultValue,
  isRequired,
  register,
  type,
}: FormRowCustomerProps) {
  return (
    <ExtendFormRow
      fieldName={label}
      registerFn={register}
      translationNS='customers'
      keyPrefix='details'
      error={error}
      defaultValue={defaultValue}
      maxLength={maxLength}
      type={type}
      isRequired={isRequired}
    />
  );

  // <FormRow
  //   label={t("details." + label)}
  //   defaultValue={defaultValue}
  //   error={error?.message}
  //   register={register(label, {
  //     required: isRequired ? t("form.required") : undefined,
  //     maxLength:
  //       maxLength != undefined
  //         ? {
  //             value: maxLength,
  //             message: t("form.too-big-text", { length: maxLength }),
  //           }
  //         : undefined,
  //   })}
  //   isRequired={isRequired}
  //   type={type}
  // />
}
export default FormRowCustomer;
