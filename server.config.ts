import process from "node:process";

import type { UserConfig } from "./server/app";

const configFromEnv = Object.entries(<Record<string, keyof UserConfig>>{
  FOSSILBOX_HOST: "host",
  FOSSILBOX_PORT: "port",
}).reduce((map: UserConfig, [key, value]) => {
  const env = process.env[key];
  !!env && (map[value] = process.env[key]);
  return map;
}, {});

export default <UserConfig>{
  host: "127.0.0.1",
  ...configFromEnv,
};
