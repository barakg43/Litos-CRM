import { AlertStatus, createStandaloneToast } from "@chakra-ui/react";
import i18next from "i18next";
import theme from "../styles/ChakraTheme";
export function calculateForwardDateByMonthsAndDays({
  startDate,
  months = 0,
  days = 0,
}: {
  startDate: Date;
  months?: number;
  days?: number;
}): Date {
  const forwardDate = new Date(startDate);
  forwardDate.setDate(forwardDate.getDate() + days - 1);
  forwardDate.setMonth(forwardDate.getMonth() + months);
  return forwardDate;
}
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";

export function getStringDate(date: Date) {
  const localDate = new Date(date);
  const day = String(localDate.getDate()).padStart(2, "0");
  const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Months are zero based
  const year = localDate.getFullYear();
  return `${day}/${month}/${year}`;
}
export const getPagesAmount = (
  totalItemsAmount: number,
  itemsPerPage: number
) => Math.ceil(totalItemsAmount / itemsPerPage);

export function capitalize(str: string) {
  return str.replace(str[0], str[0].toUpperCase());
}

const { toast } = createStandaloneToast({ theme });
/**
 * Shows a toast notification with a translated title and description.
 *
 * @param {TranslateToast} props
 * @param {AlertStatus} [props.status] The type of the toast notification.
 * @param {string} [props.descriptionKey] The key of the description to translate.
 * @param {string} props.titleKey The key of the title to translate.
 * @param {string} [props.keyPrefix] The key prefix to use for translation.
 * @param {string} props.translationNS The translation namespace to use.
 */
export function translateToast({
  status,
  descriptionKey,
  titleKey,
  keyPrefix,
  translationNS,
}: {
  status?: AlertStatus;
  descriptionKey: string;
  titleKey: string;
  keyPrefix?: string;
  translationNS: string;
}) {
  /**
   * Helper function to translate a key using the given settings.
   *
   * @param {{ keyPrefix?: string; translationNS: string; key: string }} props
   * @returns {string}
   */
  const trans = ({
    keyPrefix,
    translationNS,
    key,
  }: {
    keyPrefix?: string;
    translationNS: string;
    key: string;
  }) =>
    i18next.t(keyPrefix ? `${keyPrefix}.${key}` : key, { ns: translationNS });
  toast({
    description: descriptionKey
      ? trans({ keyPrefix, translationNS, key: descriptionKey })
      : undefined,
    title: trans({ keyPrefix, translationNS, key: titleKey }),
    status,
  });
}
