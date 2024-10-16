import { loadConfig } from "c12";
import consola from "consola";
import process from "node:process";
import readline from "node:readline";

import app from "./app";

(async () => {
  const config = await loadConfig({ name: "server" });
  const { server, viteDevServer } = await app(config.config);

  readline.emitKeypressEvents(process.stdin);

  process.stdin.on("keypress", (_, key?: {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
  }) => {
    if ([
      key?.ctrl && key.name === "c",
      key?.name === "q",
    ].some(Boolean)) {
      consola.log("goodbye~");
      server.close();
      viteDevServer?.close();
      process.exit(0);
    }
  });

  process.stdin.setRawMode(true);
})();
