import { vitePlugin as remix } from "@remix-run/dev";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import replace from "./plugins/replace";

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    unocss(),
    remix({ buildDirectory: "dist" }),
    replace({ mode }),
  ],
}));
