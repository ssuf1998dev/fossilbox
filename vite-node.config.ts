import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import helper from "./plugins/helper";
import replace from "./plugins/replace";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    helper(),
    replace({ mode: "development" }),
  ],
});
