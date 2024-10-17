import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "@server/auth";
import { commitSession, getSession } from "@server/session";

export default function Login() {
  return (
    <Form method="post">
      <input type="email" name="email" required />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user", request, {
    successRedirect: "/home",
    failureRedirect: "/login",
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/home",
  });
  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey);
  return json({ error }, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};
