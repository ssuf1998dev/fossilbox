import "@radix-ui/themes/styles.css";
import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HTTPBackend from "i18next-http-backend";
import "normalize.css";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next/client";
import "virtual:uno.css";

import i18nConfig, { initialized as i18nInitialized } from "./locales/config";

async function hydrate() {
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HTTPBackend)
    .init({
      ...i18nConfig,
      lng: undefined,
      ns: getInitialNamespaces(),
      backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
      detection: { order: ["htmlTag"], caches: [] },
    });
  i18nInitialized(i18next);

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>,
    );
  });
}

window.requestIdleCallback
  ? window.requestIdleCallback(hydrate)
  : setTimeout(hydrate, 0);
