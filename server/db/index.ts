import type { Express } from "express";

import { DatabaseNotSupported } from "@server/errors";
import { drizzle } from "drizzle-orm/libsql";
import fs from "node:fs";
import path from "node:path";

import * as cli from "./cli";

export default async function db(app: Express, config: FossilboxServer.UserConfig) {
  if (config.db === "sqlite") {
    if (!fs.existsSync(config.sqlite.file)) {
      fs.mkdirSync(path.dirname(config.sqlite.file), { recursive: true });
      await cli.push({
        dialect: "sqlite",
        schema: path.join(__dirname, "schema/sqlite"),
        url: config.sqlite.file,
      });
    }

    const db = drizzle(`file:${config.sqlite.file}`);
    app.set("db", db);
    return db;
  }

  throw new DatabaseNotSupported(config.db);
}
