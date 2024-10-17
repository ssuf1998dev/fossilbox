import replace from "@rollup/plugin-replace";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import helper from "./plugins/helper";

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["tsconfig.app.json", "tsconfig.server.json"] }),
    helper(),
    replace({
      ...Object.entries({
        "process.env.NODE_ENV": "development",
      }).reduce((map: Record<string, string>, [key, value]) => {
        map[key] = JSON.stringify(value);
        return map;
      }, {}),
      preventAssignment: true,
    }),
  ],
});
