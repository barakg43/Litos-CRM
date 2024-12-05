import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

function NoAccessPermission() {
  const { t } = useTranslation("components");
  return <Text>{t("no-access-permission")}</Text>;
}

export default NoAccessPermission;
