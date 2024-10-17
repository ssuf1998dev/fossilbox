/// <reference types="vite/client" />

import type db from "./db";

declare global {
  namespace FossilboxServer {
    type UserConfig = {
      host?: string;
      port?: string | number;
    } & {
      db: "sqlite";
      sqlite: {
        file: string;
      };
    };
    type DatabaseInstance = Exclude<Awaited<ReturnType<typeof db>>, void>;
  }
}
