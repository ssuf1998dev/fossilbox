import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { Form } from "@remix-run/react";
import { authenticator } from "@server/modules/auth";
import { AuthorizationError } from "remix-auth";

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

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("user", request, {
      successRedirect: "/home",
      throwOnError: true,
      context,
    });
  }
  catch (error) {
    if (error instanceof Response) {
      return error;
    }
    if (error instanceof AuthorizationError) {
      return new Response(null, { status: 403 });
    }
    return new Response(null, { status: 500 });
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/home",
  });
  return null;
};
