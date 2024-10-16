import { createRequestHandler } from "@remix-run/express";
import consola from "consola";
import express from "express";
import process from "node:process";
import * as dist from "virtual:dist";

export interface UserConfig {
  host?: string;
  port?: string | number;
};

export default async function app(config: UserConfig) {
  const viteDevServer = process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then(async vite => vite.createServer({
      server: { middlewareMode: true },
    }));

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

  app.all("*", createRequestHandler({ build }));

  const host = config.host || "127.0.0.1";
  const port = Number(config.port) || 6330;

  const server = app.listen(port, host, () => {
    if (!import.meta.hot?.data?.reloaded) {
      consola.success(`app listening on http://${host}:${port}.`);
      consola.info("`ctrl+c` or `q` to quit.");
    }
  });

  if (import.meta.hot) {
    const dispose = async () => {
      server.close();
      await viteDevServer?.close();
      import.meta.hot!.data.reloaded = true;
      consola.info("code changed, reloaded");
    };

    import.meta.hot.on("vite:beforeFullReload", dispose);
    import.meta.hot.dispose(dispose);
  }

  return { server, viteDevServer };
}