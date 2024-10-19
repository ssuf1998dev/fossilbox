import { vitePlugin as remix } from "@remix-run/dev";
import replace from "@rollup/plugin-replace";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths({ projects: ["tsconfig.app.json", "tsconfig.server.json"] }),
    remix({ appDirectory: "src/app", buildDirectory: "dist" }),
    replace({
      ...Object.entries({
        "process.env.NODE_ENV": mode,
      }).reduce((map: Record<string, string>, [key, value]) => {
        map[key] = JSON.stringify(value);
        return map;
      }, {}),
      preventAssignment: true,
    }),
  ],
}));
