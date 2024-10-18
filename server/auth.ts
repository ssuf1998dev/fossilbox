// import crypto from "crypto-js";
// import { eq } from "drizzle-orm";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import type sqliteUsersTable from "./db/schema/sqlite/users";

import { sessionStorage } from "./session";

export const authenticator = new Authenticator<typeof sqliteUsersTable.$inferSelect | void>(
  sessionStorage,
  { sessionErrorKey: "sessionError" },
);

authenticator.use(
  new FormStrategy(async () => {
    // const email = form.get("email");
    // const password = form.get("password");

    // const { db, config } = context!;

    // if (config.db === "sqlite") {
    //   const user = (await db!.select().from(sqliteUsersTable).where(
    //     eq(sqliteUsersTable.email, email!.toString()),
    //   ))[0];
    //   const hash = crypto.PBKDF2("Secret Passphrase", user.salt, {
    //     keySize: 128 / 32,
    //   });
    // }

    // const db = await database();

    // if (db.type === "sqlite") {
    //   const user = (await db.select().from(sqliteUsersTable).where(
    //     eq(sqliteUsersTable.email, email!.toString()),
    //   ))[0];
    //   const hash = crypto.PBKDF2("Secret Passphrase", user.salt, {
    //     keySize: 128 / 32,
    //   });

    //   return user;
    // }
  }),
  "user",
);
