/// <reference path="./app/shims.d.ts" />

export default {
  logLevel: "http",
  host: "127.0.0.1",
  db: "sqlite",
  sqlite: {
    file: "/data/db.sqlite",
  },
  $development: {
    logLevel: "silly",
    db: "sqlite",
    sqlite: {
      file: "tmp/db.sqlite",
    },
  },
} satisfies FossilboxServer.UserConfig;
