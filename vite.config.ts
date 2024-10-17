import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["tsconfig.app.json", "tsconfig.server.json"] }),
    remix({ buildDirectory: "dist" }),
  ],
});
