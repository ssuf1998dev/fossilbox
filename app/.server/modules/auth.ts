import crypto from "crypto-js";
import { eq } from "drizzle-orm";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";

import sqliteUsersTable from "../db/schemas/sqlite/users";
import { DatabaseNotSupported } from "./errors";
import { sessionStorage } from "./session";

export const authenticator = new Authenticator<typeof sqliteUsersTable.$inferSelect>(
  sessionStorage,
);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    ["email", "password"].forEach((item) => {
      invariant(form.get(item)?.toString(), `missing form field \`${item}\``);
    });

    const { db, config } = context!;

    const user = await (async () => {
      if (config.db === "sqlite") {
        const selected = (await db!.select().from(sqliteUsersTable).limit(1).where(
          eq(sqliteUsersTable.email, form.get("email")!.toString()),
        ))[0];
        return selected;
      }

      throw new DatabaseNotSupported(config.db);
    })();

    if (!user) {
      throw new AuthorizationError();
    }

    const hashPassword = crypto.PBKDF2(form.get("password")!.toString(), user.salt, {
      keySize: 128 / 32,
    });
    if (hashPassword.toString() !== user.password) {
      throw new AuthorizationError();
    }

    return user;
  }),
  "user",
);
