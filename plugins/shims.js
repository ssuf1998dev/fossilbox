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
const __filename = __fileURLToPath(import.meta.url);
const __dirname = __path.dirname(__filename);
`);
      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    },
  };
  return plugin;
}
