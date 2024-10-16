import { defineConfig } from "vite";

import helper from "./plugins/helper";

export default defineConfig({
  plugins: [helper()],
});
