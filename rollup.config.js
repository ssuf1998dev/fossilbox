import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import fs from "node:fs";

import helper from "./plugins/helper.js";
import shims from "./plugins/shims.js";

const pkg = JSON.parse(fs.readFileSync("package.json").toString());

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "server/index.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
  external: [
    ...Object.keys(pkg.dependencies),
    "vite",
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    json(),
    typescript({ tsconfig: "tsconfig.server.json" }),
    commonjs(),
    shims(),
    replace({
      ...Object.entries({
        "process.env.NODE_ENV": "production",
        "import.meta.hot": undefined,
      }).reduce((map, [key, value]) => {
        map[key] = JSON.stringify(value);
        return map;
      }, {}),
      preventAssignment: true,
    }),
    helper(),
  ],
};

export default config;
