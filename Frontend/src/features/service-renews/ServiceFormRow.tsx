import { SystemStyleObject } from "@chakra-ui/react";
import { TFunction } from "i18next";
import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormRow from "../../components/FormRow";
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
  const { t } = useTranslation("serviceRenews");
  return (
    <FormRow
      label={t(label)}
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
      sx={sx}
    />
  );
}

export default ServiceFormRow;
