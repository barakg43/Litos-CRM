import { TFunction } from "i18next";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormRow, { FromRowProps } from "./FormRow";

interface ExtendFormRowProps<T extends FieldValues>
  extends Omit<FromRowProps<T>, "register" | "label"> {
  maxLength?: number;
  minLength?: number;
  t?: TFunction<string, string>;
  fieldName: Path<T>;
  registerFn: UseFormRegister<T>;
  translationNS: string;
  keyPrefix?: string;
}
function ExtendFormRow<T extends FieldValues>(
  formRowProps: ExtendFormRowProps<T>
) {
  const {
    fieldName,
    maxLength,
    minLength,
    error,
    translationNS,
    keyPrefix,
    registerFn,
    isRequired,
    type,
    ...restProps
  } = formRowProps;

  const { t } = useTranslation(translationNS, { keyPrefix });
  return (
    <FormRow
      label={t(`${fieldName}`)}
      error={error}
      register={registerFn(fieldName, {
        required: isRequired ? t("form.required") : undefined,
        valueAsNumber: type === "number",
        minLength:
          minLength != undefined
            ? {
                value: minLength,
                message: t("form.too-small-text", { length: minLength }),
              }
            : undefined,
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
      {...restProps}
    />
  );
}

export default ExtendFormRow;
