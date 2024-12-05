import { Tag } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CustomerStatus } from "../features/customers/customers";

const statusToColor: { [index: string]: string } = {
  IN_SERVICE: "blue",
  OUT_OF_SERVICE: "red",
  BANK_HOURS: "pink",
  CLOUD_SERVER: "orange",
  CLOUD_MAIL: "green",
  CHARGE: "yellow",
  none: "white",
};

function StatusTag({ status }: { status: CustomerStatus | "none" }) {
  const { t } = useTranslation("customers", { keyPrefix: "status" });

  const statusString = status || "none";
  return statusString !== "none" ? (
    <Tag
      backgroundColor={statusToColor[statusString]}
      justifyContent='center'
      size='xl'
      borderRadius='20px'
      padding='0.5rem 5rem 0.5rem 5rem'
      margin='auto'
    >
      {t(statusString)}
    </Tag>
  ) : null;
}

export default StatusTag;
