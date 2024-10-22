import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { json } from "@remix-run/node";
import sqliteUsersTable from "@server/db/schemas/sqlite/users";
import { DatabaseNotSupported } from "@server/modules/errors";
import invariant from "tiny-invariant";

export async function action({ request, context }: ActionFunctionArgs) {
  if (!["POST"].includes(request.method)) {
    return new Response(null, { status: 405 });
  }

  const form = await request.formData();
  ["email", "password", "salt"].forEach((item) => {
    invariant(form.get(item)?.toString(), `missing form field \`${item}\``);
  });

  const { db, config } = context;

  if (config.db === "sqlite") {
    const user = await db.insert(sqliteUsersTable).values({
      email: form.get("email")!.toString(),
      password: form.get("password")!.toString(),
      salt: form.get("salt")!.toString(),
    });
    return json(user);
  }

  return json(new DatabaseNotSupported(config.db).cause, { status: 500 });
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { db, config } = context;

  if (config.db === "sqlite") {
    const users = await db.select().from(sqliteUsersTable);
    return json(users);
  }

  return json(new DatabaseNotSupported(config.db).cause, { status: 500 });
}
