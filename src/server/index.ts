import type { RequestHandler } from "express";

import { createRequestHandler } from "@remix-run/express";
import { watchConfig } from "c12";
import express from "express";
import { cloneDeep } from "lodash-es";
import process from "node:process";
import pc from "picocolors";
import * as dist from "virtual:dist";

import database from "./db";
import createLogger from "./modules/logger";
import routes from "./routes";

function createHTTPLogger(level?: string) {
  const logger = createLogger({ label: "server", level });
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  return <RequestHandler>((req, resp, next) => {
    const start = process.hrtime();

    resp.on("finish", () => {
      const diff = process.hrtime(start);
      const duration = ~~((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS);

      logger.http([
        req.method.toUpperCase(),
        req.url,
        resp.statusCode,
        pc.dim(`${duration}ms`),
      ].filter(Boolean).join(" "));
    });

    next();
  });
}

async function app(config: FossilboxServer.UserConfig, reloaded?: boolean) {
  const logger = createLogger({ label: "app", level: config.logLevel });

  const viteDevServer = process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then(async vite => vite.createServer({
      server: { middlewareMode: true },
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
  app.set("config", config);
  const db = await database(config);
  app.set("db", db);
  routes(app);
  app.use(createHTTPLogger(config.logLevel));
  app.all("*", createRequestHandler({
    build,
    getLoadContext: () => ({ db, config }),
  }));

  const host = config.host!;
  const port = Number.isNaN(Number(config.port)) ? 6330 : Number(config.port);

  const server = app.listen(port, host, () => {
    if (!import.meta.hot?.data?.reloaded && !reloaded) {
      logger.info(`app listening on \`http://${host}:${port}\`.`);
    }
  });

  if (import.meta.hot) {
    const dispose = async () => {
      server.close();
      await viteDevServer?.close();
      import.meta.hot!.data.reloaded = true;
      logger.info("hmr update.");
    };

    import.meta.hot.on("vite:beforeFullReload", dispose);
    import.meta.hot.dispose(dispose);
  }

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
  let initialized: Awaited<ReturnType<typeof app>> | void;
  const config = await watchConfig<FossilboxServer.UserConfig>({
    name: "fossilbox",
    rcFile: false,
    globalRc: false,
    acceptHMR({ getDiff }) {
      return getDiff().length === 0;
    },
    async onUpdate({ newConfig }) {
      if (initialized) {
        initialized.logger.info("reload for config update.");
        initialized.server.close();
        await initialized.viteDevServer?.close();
        initialized = await app(deepFreeze(cloneDeep(newConfig.config)), true);
      }
    },
    defaults: {
      host: "127.0.0.1",
      port: 6330,
      db: "sqlite",
      sqlite: {
        file: "/data/db.sqlite",
      },
    },
  });
  initialized = await app(deepFreeze(cloneDeep(config.config)));
})();
