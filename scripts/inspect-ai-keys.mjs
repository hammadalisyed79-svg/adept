import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function scanFile(f) {
  if (!existsSync(f)) return null;
  const text = readFileSync(f, "utf8");
  const keys = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const name = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    const lower = name.toLowerCase();
    const interesting =
      lower.includes("openai") ||
      lower.includes("anthropic") ||
      lower.includes("claude") ||
      lower === "api_key" ||
      lower.endsWith("_api_key") ||
      val.startsWith("sk-");
    if (interesting) {
      keys.push({
        name,
        present: val.length > 0,
        len: val.length,
        skStyle: val.startsWith("sk-"),
        placeholder: /your_|changeme|example|xxx|replace|todo/i.test(val),
      });
    }
  }
  return { file: f, keys };
}

const roots = [".", "env", "config"];
const files = [];
for (const r of roots) {
  if (!existsSync(r)) continue;
  if (r === ".") {
    for (const n of readdirSync(".")) {
      if (n.startsWith(".env") || n.endsWith(".env")) files.push(n);
    }
  } else {
    for (const n of readdirSync(r)) {
      if (n.includes("env") || n.includes(".env")) files.push(join(r, n));
    }
  }
}

const results = files.map(scanFile).filter(Boolean);
console.log(JSON.stringify({ scanned: files, results }, null, 2));
