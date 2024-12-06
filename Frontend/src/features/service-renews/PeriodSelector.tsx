import { SystemStyleObject } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomRadioGroup from "./CustomRadioGroup";
import { PeriodType } from "./serviceRenews";

type PeriodSelectorProps = {
  defaultValue: PeriodType;
  register: UseFormRegisterReturn<string> | undefined;
  onChange?: (value: PeriodType) => void;
  sx?: SystemStyleObject | undefined;
};
function PeriodSelector({
  defaultValue,
  register,
  onChange,
  sx,
}: PeriodSelectorProps) {
  const { t } = useTranslation("serviceRenews");

  const options = [
    { value: "MONTHLY", label: t("period.MONTHLY") },
    { value: "QUARTERLY", label: t("period.QUARTERLY") },
    { value: "YEARLY", label: t("period.YEARLY") },
  ];
  return (
    <CustomRadioGroup
      options={options}
      defaultValue={defaultValue}
      buttonWidth={"8rem"}
      onChange={onChange}
      label={`${t("periodKind")} :`}
      register={register}
      sx={sx}
    />
  );
}

export default PeriodSelector;
