import { DatabaseNotSupported } from "@server/modules/errors";
import { drizzle as libsqlDrizzle } from "drizzle-orm/libsql";
import fs from "node:fs";
import path from "node:path";

import * as cli from "./cli";

export default async function database(config: FossilboxServer.UserConfig) {
  if (config.db === "sqlite") {
    if (!fs.existsSync(config.sqlite.file)) {
      fs.mkdirSync(path.dirname(config.sqlite.file), { recursive: true });
      await cli.push({
        dialect: "sqlite",
        schema: path.join(__dirname, "schema/sqlite"),
        url: config.sqlite.file,
      });
    }

    return libsqlDrizzle(`file:${config.sqlite.file}`);
  }

  throw new DatabaseNotSupported(config.db);
}
