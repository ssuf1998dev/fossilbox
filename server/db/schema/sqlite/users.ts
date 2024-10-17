import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const sqliteUsersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  salt: text().notNull(),
  password: text().notNull(),
});

export default sqliteUsersTable;
