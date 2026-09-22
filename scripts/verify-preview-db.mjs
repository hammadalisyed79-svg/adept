import { existsSync, readFileSync } from "node:fs";
import { summarizeUrlIdentity } from "./lib/db-target-guard.mjs";

function load(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, eq).trim()] = v;
  }
  return out;
}

function report(label, env) {
  const keys = Object.keys(env).filter((k) =>
    /DATABASE|POSTGRES|PRISMA|RUN_DB/i.test(k),
  );
  const rows = [];
  for (const key of keys) {
    const v = env[key];
    if (!v || v === "[SENSITIVE]") {
      rows.push({ key, status: "redacted_or_empty" });
      continue;
    }
    try {
      const id = summarizeUrlIdentity(v);
      rows.push({
        key,
        userSuffix: id.userSuffix,
        isKnownStaging: id.isKnownStaging,
        isKnownProduction: id.isKnownProduction,
      });
    } catch {
      rows.push({ key, status: "unparseable" });
    }
  }
  return { label, rows };
}

console.log(
  JSON.stringify(
    {
      previewLocal: report("preview", load(".env.vercel.preview")),
      productionLocal: report("production", load(".env.vercel.production")),
    },
    null,
    2,
  ),
);
