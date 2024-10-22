import type { Plugin } from "rollup";

declare const replace: (options?: { mode?: string; unescape?: any } & Record<string, any>) => Plugin;

export { replace as default };
