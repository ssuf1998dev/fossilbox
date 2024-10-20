import type { ActionFunctionArgs } from "@remix-run/node";

import { Button, Card, TextField } from "@radix-ui/themes";
import { Form } from "@remix-run/react";
import { authenticator } from "@server/modules/auth";
import { useTranslation } from "react-i18next";
import { AuthorizationError } from "remix-auth";

export default function Login() {
  const { t } = useTranslation();

  return (
    <Card>
      <Form>
        <TextField.Root type="email" name="email" required></TextField.Root>
        <TextField.Root type="password" name="password" autoComplete="current-password" required></TextField.Root>
        <Button>{t("capital_case", { value: t("sign_in") })}</Button>
      </Form>
    </Card>
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
