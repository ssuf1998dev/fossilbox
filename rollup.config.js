import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import fs from "node:fs";

import helper from "./plugins/helper.js";
import shims from "./plugins/shims.js";

const pkg = JSON.parse(fs.readFileSync("package.json").toString());

/** @type {import('rollup').RollupOptions["plugins"]} */
const plugins = [
  nodeResolve({ preferBuiltins: true }),
  json(),
  typescript({ tsconfig: "tsconfig.server.json" }),
  commonjs(),
  shims(),
];

/** @type {import('rollup').RollupOptions} */
const server = {
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
    ...plugins,
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

/** @type {import('rollup').RollupOptions} */
const utils = {
  input: "utils/config-form-env.ts",
  output: {
    dir: "dist/utils",
    format: "esm",
  },
  plugins: [...plugins],
};

export default [server, utils];
