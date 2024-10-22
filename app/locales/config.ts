import type { InitOptions } from "i18next";
import type i18n from "i18next";

import { capitalCase, sentenceCase } from "change-case";

export default {
  lng: "en-US",
  supportedLngs: ["zh-CN", "en-US"],
  fallbackLng: "en-US",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
    defaultVariables: { what: "", key: "", src: "", dest: "", reason: "", n: "" },
  },
} satisfies InitOptions;

export function initialized(instance: typeof i18n) {
  const { formatter } = instance.services;
  if (formatter) {
    formatter.add("capitalCase", (value: string) => capitalCase(value));
    formatter.add("sentenceCase", (value: string) => sentenceCase(value));
    formatter.add("heading", (value: string, _, options) => {
      return !value ? "" : `${options.char || " "}${value}`;
    });
    formatter.add("tailing", (value: string, _, options) => {
      return !value ? "" : `${value}${options.char || " "}`;
    });
  }
}
