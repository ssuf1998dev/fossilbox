import type { EntryContext } from "@remix-run/node";

import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import serverI18n, { resources as i18nResources } from "@server/modules/locales";
import { createInstance } from "i18next";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";

import i18nConfig, { initialized as i18nInitialized } from "./locales/config";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const isbotCallbackName = isbot(request.headers.get("user-agent")) || remixContext.isSpaMode
    ? "onAllReady"
    : "onShellReady";

  const i18next = createInstance();
  const lng = await serverI18n.getLocale(request);
  const ns = serverI18n.getRouteNamespaces(remixContext);

  await i18next
    .use(initReactI18next)
    .init({ ...i18nConfig, lng, ns, resources: i18nResources });
  i18nInitialized(i18next);

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18next}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </I18nextProvider>,
      {
        [isbotCallbackName]: () => {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, { headers: responseHeaders, status: responseStatusCode }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
