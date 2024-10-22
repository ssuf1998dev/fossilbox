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
    <Card className="pos-absolute w-96 translate--50% top-3/7 left-1/2 p-8 shadow-[var(--shadow-3)] ">
      <Heading size="7" className="mt-0 mb-4">{__NAME__}</Heading>
      <Form method="POST" className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-bold">
          {t("formatting.capital_case", { value: t("email") })}
          <TextField.Root
            type="email"
            name="email"
            required
            placeholder={t("formatting.sentence_case", { value: t("form.enter", { value: t("email") }) })}
          >
          </TextField.Root>
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold">
          {t("formatting.capital_case", { value: t("password") })}
          <TextField.Root
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder={t("formatting.sentence_case", { value: t("form.enter", { value: t("password") }) })}
          >
          </TextField.Root>
        </label>
        <Button type="submit" className="w-fit self-end">
          {t("formatting.capital_case", { value: t("sign_in") })}
          <IconTablerLogin className="scale-x-[-1]"></IconTablerLogin>
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
