import { TFunction } from "i18next";
import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormRow from "../../components/FormRow.tsx";
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
  const { t } = useTranslation("customers");
  return (
    <FormRow
      label={t("details." + label)}
      defaultValue={defaultValue}
      error={error?.message}
      register={register(label, {
        required: isRequired ? t("form.required") : undefined,
        maxLength:
          maxLength != undefined
            ? {
                value: maxLength,
                message: t("form.too-big-text", { length: maxLength }),
              }
            : undefined,
      })}
      isRequired={isRequired}
      type={type}
    />
  );
}
export default FormRowCustomer;
