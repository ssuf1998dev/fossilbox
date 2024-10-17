import pathSet from "lodash-es/set";
import process from "node:process";

import type { UserConfig } from "../server";

export default () => Object.entries({
  FOSSILBOX_HOST: "host",
  FOSSILBOX_PORT: "port",
  FOSSILBOX_DB: "db",
  FOSSILBOX_SQLITE_FILE: "sqlite.file",
}).reduce((map: UserConfig, [key, value]) => {
  const env = process.env[key];
  !!env && pathSet(map, value, env);
  return map;
}, {});
