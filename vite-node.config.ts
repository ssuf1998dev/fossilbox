import replace from "@rollup/plugin-replace";
import figlet from "figlet";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "./package.json";
import helper from "./plugins/helper";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    helper(),
    replace({
      ...Object.entries({
        "process.env.NODE_ENV": "development",
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
});
