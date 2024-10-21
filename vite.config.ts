import { vitePlugin as remix } from "@remix-run/dev";
import replace from "@rollup/plugin-replace";
import figlet from "figlet";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "./package.json";

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    unocss(),
    remix({ buildDirectory: "dist" }),
    replace({
      ...Object.entries({
        "process.env.NODE_ENV": mode,
        "__NAME__": pkg.name,
        "__VERSION__": pkg.version,
        "__LOGO__": figlet.textSync(pkg.name, { font: "Small" }),
      }).reduce((map: Record<string, string>, [key, value]) => {
        map[key] = JSON.stringify(value);
        return map;
      }, {}),
      preventAssignment: true,
    }),
  ],
}));
