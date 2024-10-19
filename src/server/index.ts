import { createRequestHandler } from "@remix-run/express";
import { watchConfig } from "c12";
import consola from "consola";
import express from "express";
import { cloneDeep } from "lodash-es";
import process from "node:process";
import * as dist from "virtual:dist";

import database from "./db";
import routes from "./routes";

async function app(config: FossilboxServer.UserConfig, reloaded?: boolean) {
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

  app.set("config", config);
  const db = await database(config);
  app.set("db", db);
  routes(app);
  app.all("*", createRequestHandler({
    build,
    getLoadContext() {
      return { db, config };
    },
  }));

  const host = config.host!;
  const port = Number.isNaN(Number(config.port)) ? 6330 : Number(config.port);

  const server = app.listen(port, host, () => {
    if (!import.meta.hot?.data?.reloaded && !reloaded) {
      consola.success(`app listening on \`http://${host}:${port}\`.`);
    }
  });

  if (import.meta.hot) {
    const dispose = async () => {
      server.close();
      await viteDevServer?.close();
      import.meta.hot!.data.reloaded = true;
      consola.info("hmr update.");
    };

    import.meta.hot.on("vite:beforeFullReload", dispose);
    import.meta.hot.dispose(dispose);
  }

  return { server, viteDevServer };
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
      consola.info("config update.");
      if (initialized) {
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
