import { DatabaseNotSupported } from "@server/errors";
import crypto from "crypto-js";
import { eq } from "drizzle-orm";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import sqliteUsersTable from "../db/schema/sqlite/users";
import { sessionStorage } from "./session";

export const authenticator = new Authenticator<typeof sqliteUsersTable.$inferSelect>(
  sessionStorage,
);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    const email = (form.get("email") ?? "").toString();
    const password = (form.get("password") ?? "").toString();

    if (!email || !password) {
      throw new AuthorizationError();
    }

    const { db, config } = context!;

    const user = await (async () => {
      if (config.db === "sqlite") {
        const selected = (await db!.select().from(sqliteUsersTable).limit(1).where(
          eq(sqliteUsersTable.email, email),
        ))[0];
        return selected;
      }

      throw new DatabaseNotSupported(config.db);
    })();

    if (!user) {
      throw new AuthorizationError();
    }

    const hashPassword = crypto.PBKDF2(password, user.salt, {
      keySize: 128 / 32,
    });
    if (hashPassword.toString() !== user.password) {
      throw new AuthorizationError();
    }

    return user;
  }),
  "user",
);
