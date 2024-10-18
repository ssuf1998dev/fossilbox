import { createRequestHandler } from "@remix-run/express";
import { loadConfig } from "c12";
import consola from "consola";
import express from "express";
import process from "node:process";
import * as dist from "virtual:dist";

import database from "./db";
import routes from "./routes";

async function app(config: FossilboxServer.UserConfig) {
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
    : await import(dist.server,);

  app.set("config", config);
  const db = await database(config);
  app.set("db", db);
  routes(app);
  app.all("*", createRequestHandler({ build, getLoadContext: () => ({ db, config }) }));

  const host = config.host || "127.0.0.1";
  const port = Number(config.port) || 6330;

  const server = app.listen(port, host, () => {
    if (!import.meta.hot?.data?.reloaded) {
      consola.success(`app listening on http://${host}:${port}.`);
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

(async () => {
  const config = await loadConfig<FossilboxServer.UserConfig>({
    name: process.env.NODE_ENV === "production" ? "server" : "server.dev",
  });
  await app(config.config);
})();
