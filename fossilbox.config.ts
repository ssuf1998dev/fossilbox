/// <reference path="./src/server/shims.d.ts" />

export default {
  host: "127.0.0.1",
  db: "sqlite",
  sqlite: {
    file: "/data/db.sqlite",
  },
  $development: {
    db: "sqlite",
    sqlite: {
      file: "tmp/db.sqlite",
    },
  },
} satisfies FossilboxServer.UserConfig;
