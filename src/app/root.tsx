import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";
import "virtual:uno.css";

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
