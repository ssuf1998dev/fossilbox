import rollupReplace from "@rollup/plugin-replace";
import figlet from "figlet";
import { getPackageInfoSync } from "local-pkg";

export default function replace(options) {
  const { mode, unescape, ...left } = options ?? {};
  const pkg = getPackageInfoSync(".")?.packageJson ?? {};
  return rollupReplace(
    {
      ...Object.entries({
        "process.env.NODE_ENV": mode || "production",
        "__NAME__": pkg.name,
        "__VERSION__": pkg.version,
        "__LOGO__": pkg.name && figlet.textSync(pkg.name, { font: "Small" }),
        ...left,
      }).reduce((map, [key, value]) => {
        map[key] = JSON.stringify(value);
        return map;
      }, {}),
      ...unescape,
      preventAssignment: true,
    },
  );
}
