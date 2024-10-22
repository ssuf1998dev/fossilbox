import config from "@/locales/config";
import { RemixI18Next } from "remix-i18next/server";

const i18n = new RemixI18Next({
  detection: {
    supportedLanguages: config.supportedLngs,
    fallbackLanguage: config.fallbackLng,
  },
  i18next: { ...config },
});

export default i18n;

export const resources: Record<string, Record<string, any>> = Object.entries(
  import.meta.glob("../../locales/*/*.json", { eager: true }),
).map<[string, any]>(([file, mod]) => {
  const lng = file.split("/").at(-2)!;
  const ns = file.split("/").at(-1)?.split(".")[0] ?? "common";
  return [lng, { [ns]: (mod as any).default }];
}).reduce((map: Record<string, any>, [lng, value]) => {
  if (!map[lng]?.common && value.common) {
    map[lng] = value;
    return map;
  }

  Object.assign(map[lng].common, value);
  return map;
}, {});
