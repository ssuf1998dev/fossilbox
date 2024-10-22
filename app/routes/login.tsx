import type { ActionFunctionArgs } from "@remix-run/node";

import { Button, Card, Heading, TextField } from "@radix-ui/themes";
import { Form } from "@remix-run/react";
import { authenticator } from "@server/modules/auth";
import IconTablerLogin from "~icons/tabler/login";
import { useTranslation } from "react-i18next";
import { AuthorizationError } from "remix-auth";

export default function Login() {
  const { t } = useTranslation();

  return (
    <Card className="pos-absolute w-64 translate--50% top-1/2 left-1/2 p-6 shadow-[var(--shadow-3)] after-content-none">
      <Heading size="5" className="mt-0">{__NAME__}</Heading>
      <Form method="POST" className="flex flex-col gap-4">
        <TextField.Root type="email" name="email" required></TextField.Root>
        <TextField.Root type="password" name="password" autoComplete="current-password" required></TextField.Root>
        <Button type="submit" className="w-fit self-end">
          <IconTablerLogin></IconTablerLogin>
          {t("capital_case", { value: t("sign_in") })}
        </Button>
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
