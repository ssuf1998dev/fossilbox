import { createRequestHandler } from "@remix-run/express";
import { loadConfig } from "c12";
import express from "express";
import { cloneDeep } from "lodash-es";
import process from "node:process";
import * as dist from "virtual:dist";

import database from "./db";
import { createAppLogger, createHTTPLogger, createViteDevServerLogger } from "./modules/logger";

async function app(config: FossilboxServer.UserConfig, configFile?: string) {
  const logger = createAppLogger(config.logLevel);

  const viteDevServer = process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then(async vite => vite.createServer({
      customLogger: createViteDevServerLogger(config.logLevel),
      server: {
        middlewareMode: true,
        warmup: { clientFiles: ["app/routes/**/*.{ts,tsx}"] },
      },
    }));

  import.meta.hot && process.once("uncaughtException", () => {
    viteDevServer?.close();
  });

  const app = express();
  app.use(viteDevServer
    ? viteDevServer.middlewares
    : express.static(dist.client),
  );

  const build: any = viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
          "virtual:remix/server-build",
        )
    : await import(dist.server);

  app.set("x-powered-by", false);
  const db = await database(config);
  app.use(createHTTPLogger(config.logLevel));
  app.all("*", createRequestHandler({ build, getLoadContext: () => ({ db, config }) }));

  const host = config.host!;
  const port = Number.isNaN(Number(config.port)) ? 6330 : Number(config.port);

  const server = app.listen(port, host, () => {
    // eslint-disable-next-line no-console
    __LOGO__ && console.log(__LOGO__);

    configFile && logger.info(`found config: \`${configFile}\`.`);
    logger.info(`listening on \`http://${host}:${port}\`.`);
  });

  return { server, viteDevServer, logger };
}

function deepFreeze<T extends object>(object: T) {
  const propNames = Reflect.ownKeys(object);
  for (const name of propNames) {
    const value = (object as any)[name];
    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

(async () => {
  const config = await loadConfig<FossilboxServer.UserConfig>({
    name: __NAME__,
    rcFile: false,
    globalRc: false,
    defaults: {
      host: "127.0.0.1",
      port: 6330,
      db: "sqlite",
      sqlite: {
        file: "/data/db.sqlite",
      },
    },
  });
  await app(deepFreeze(cloneDeep(config.config)), config.configFile);
})();
