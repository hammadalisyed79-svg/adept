import { existsSync, readFileSync } from "node:fs";

const files = [".env", ".env.local", ".env.example"];
const found = {};

for (const f of files) {
  if (!existsSync(f)) continue;
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]*OPENAI[A-Z0-9_]*)\s*=\s*(.*)$/i);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    found[m[1]] = {
      file: f,
      present: v.length > 0,
      len: v.length,
      looksLikeKey: v.startsWith("sk-"),
      placeholder: /your_|changeme|example|xxx|replace/i.test(v),
    };
  }
}

const pkg = readFileSync("package.json", "utf8");
console.log(
  JSON.stringify(
    {
      found,
      packageHasOpenai: /"openai"\s*:/.test(pkg),
    },
    null,
    2,
  ),
);
