import type { Plugin } from "rollup";

declare const shims: () => Plugin;

export { shims as default };
