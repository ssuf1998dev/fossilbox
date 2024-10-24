/* eslint-disable vars-on-top, no-var */
/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/react" />

import type { drizzle as libsqlDrizzle } from "drizzle-orm/libsql";

declare global {
  namespace FossilboxServer {
    type UserConfig = {
      logLevel?: "silly" | "debug" | "verbose" | "http" | "info" | "warn" | "error";
      host?: string;
      port?: string | number;
      sessionSecret?: string;
    } & {
      db: "sqlite";
      sqlite: {
        file: string;
      };
    } & {
      $development?: Omit<UserConfig, "$development">;
    };

    type DatabaseInstance = ReturnType<typeof libsqlDrizzle> & { type?: "sqlite" };
  }
  var __NAME__: string;
  var __VERSION__: string;
  var __LOGO__: string;
}

export * from "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    db: FossilboxServer.DatabaseInstance;
    config: FossilboxServer.UserConfig;
  }
}
