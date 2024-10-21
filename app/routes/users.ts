import { json, type LoaderFunctionArgs } from "@remix-run/node";
import sqliteUsersTable from "@server/db/schema/sqlite/users";
import { DatabaseNotSupported } from "@server/modules/errors";

export async function loader({ context }: LoaderFunctionArgs) {
  const { db, config } = context;

  if (config.db === "sqlite") {
    const users = await db.select().from(sqliteUsersTable);
    return json(users);
  }

  return json(new DatabaseNotSupported(config.db).cause, { status: 500 });
}
