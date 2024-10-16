export default function helper() {
  /** @type {import('rollup').Plugin} */
  const plugin = {
    name: "helper",
    resolveId(id) {
      if (["virtual:dist"].includes(id)) {
        return `\0${id}`;
      }
    },
    load(id) {
      if (id === "\0virtual:dist") {
        return `
import path from "node:path";
export const client = path.join(__dirname, "client");
export const server = path.join(__dirname, "server/index.js");
        `;
      }
    },
  };
  return plugin;
}
