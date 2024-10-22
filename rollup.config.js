import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { getPackageInfoSync } from "local-pkg";
import fs from "node:fs";
import path from "node:path";

import helper from "./plugins/helper.js";
import replace from "./plugins/replace.js";
import shims from "./plugins/shims.js";

const pkg = JSON.parse(fs.readFileSync("package.json").toString());

/**
 * @param {string} pkg
 */
function getDynamicRequireTargets(pkg) {
  const info = getPackageInfoSync(pkg);
  const { os = [], optionalDependencies = {} } = info?.packageJson ?? {};
  const test = new RegExp(`^@${pkg}/(${os.join("|")})-`);
  return Object.keys(optionalDependencies).filter(key => test.test(key)).map(item => path.join(item, "*"));
}

/** @type {import('rollup').RollupOptions["plugins"]} */
const plugins = [
  nodeResolve({ preferBuiltins: true }),
  json(),
  typescript(),
  commonjs({
    dynamicRequireTargets: [
      ...getDynamicRequireTargets("libsql"),
    ],
    ignoreDynamicRequires: true,
  }),
  shims(),
];

/** @type {import('rollup').RollupOptions} */
const server = {
  input: "app/.server/index.ts",
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
    replace({ "mode": "production", "import.meta.hot": undefined }),
    helper(),
  ],
};

export default [server];
