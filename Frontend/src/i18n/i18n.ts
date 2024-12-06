import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    backend: {
      // Adjust the path based on your folder structure
      loadPath: "locales/{{lng}}/{{ns}}.json",
    },
    fallbackLng: "he",
    debug: false,
    load: "currentOnly",
    preload: ["he", "en"],
    defaultNS: "he",
    ns: [
      "appLayout",
      "components",
      "customers",
      "pageNotFound",
      "productRenews",
      "serviceRenews",
    ],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

export function isRtlLang() {
  return document.dir === "rtl";
}
