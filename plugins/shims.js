import MagicString from "magic-string";

export default function shims() {
  /** @type {import('rollup').Plugin} */
  const plugin = {
    name: "shims",
    renderChunk(code, chunk) {
      if (!chunk.fileName.endsWith(".js")) {
        return;
      }
      const s = new MagicString(code);
      s.prepend(`
import __path from "node:path";
import { fileURLToPath as __fileURLToPath } from "node:url";
import { createRequire as __createRequire } from "node:module";
const __filename = __fileURLToPath(import.meta.url);
const __dirname = __path.dirname(__filename);
const require = __createRequire(import.meta.url);
`);
      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    },
  };
  return plugin;
}
