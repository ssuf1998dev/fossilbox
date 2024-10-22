import type { LoaderFunctionArgs } from "@remix-run/node";
import type { PropsWithChildren } from "react";

import { Theme } from "@radix-ui/themes";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "@remix-run/react";
import { authenticator } from "@server/modules/auth";
import serverI18n from "@server/modules/locales";
import { useChangeLanguage } from "remix-i18next/react";

export function Layout({ children }: PropsWithChildren) {
  const { locale } = useLoaderData<typeof loader>();
  useChangeLanguage(locale);

  return (
    <html lang={locale}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Theme className="pos-relative bg-[var(--accent-2)]">
      <Outlet />
    </Theme>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const isPublic = ["/login", "/signup"].includes(new URL(request.url).pathname);
  await authenticator.isAuthenticated(request, {
    successRedirect: "/home",
    failureRedirect: isPublic ? undefined as never : "/login",
  });

  const locale = await serverI18n.getLocale(request);
  return json({ locale });
};
