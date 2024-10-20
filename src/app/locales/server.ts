import { RemixI18Next } from "remix-i18next/server";

import config from "./config";

const i18n = new RemixI18Next({
  detection: {
    supportedLanguages: config.supportedLngs,
    fallbackLanguage: config.fallbackLng,
  },
  i18next: { ...config },
});

export default i18n;

export const resources: Record<string, Record<string, any>> = Object.entries(
  import.meta.glob("./*/*.json", {
    eager: true,
  }),
).map<[string, any]>((entry) => {
  const lng = entry[0].split("/")[1];
  const ns = entry[0].split("/").at(-1)?.split(".")[0] ?? "common";
  return [lng, { [ns]: (entry[1] as any).default }];
}).reduce((map: Record<string, any>, entry) => {
  if (!Object.hasOwn(map, entry[0]))
    map[entry[0]] = {};

  Object.assign(map[entry[0]], entry[1]);
  return map;
}, {});
