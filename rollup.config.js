import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import figlet from "figlet";
import { getPackageInfoSync } from "local-pkg";
import fs from "node:fs";
import path from "node:path";

import helper from "./plugins/helper.js";
import shims from "./plugins/shims.js";

const pkg = JSON.parse(fs.readFileSync("package.json").toString());

/**
 * @param {string} pkg
 */
function getDynamicRequireTargets(pkg) {
  const info = getPackageInfoSync(pkg);
  const { os = [], optionalDependencies = {} } = info.packageJson;
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
    replace({
      ...Object.entries({
        "process.env.NODE_ENV": "production",
        "import.meta.hot": undefined,
        "__NAME__": pkg.name,
        "__VERSION__": pkg.version,
        "__LOGO__": figlet.textSync(pkg.name, { font: "Small" }),
      }).reduce((map, [key, value]) => {
        map[key] = JSON.stringify(value);
        return map;
      }, {}),
      preventAssignment: true,
    }),
    helper(),
  ],
};

export default [server];
