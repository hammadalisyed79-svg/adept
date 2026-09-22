import { readFileSync, existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function load(path) {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    env[t.slice(0, eq).trim()] = v;
  }
  return env;
}

const file = load(".env");
const url =
  file.DATABASE_URL_PRISMA_DATABASE_URL ||
  file.DATABASE_URL_DATABASE_URL ||
  file.DATABASE_URL_POSTGRES_URL;
if (!url) {
  console.log(JSON.stringify({ error: "no hosted url" }));
  process.exit(1);
}
process.env.DATABASE_URL = url;
const prisma = new PrismaClient();
const ref = process.argv[2];
const row = await prisma.businessInquiry.findUnique({
  where: { reference: ref },
  select: {
    reference: true,
    inquiryType: true,
    notificationStatus: true,
    createdAt: true,
  },
});
const deliveries = row
  ? await prisma.notificationDelivery.findMany({
      where: { inquiry: { reference: ref }, channel: "EMAIL" },
      select: { status: true, recipient: true, error: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    })
  : [];
console.log(
  JSON.stringify(
    {
      inquiry: row,
      emailDeliveries: deliveries.map((d) => ({
        status: d.status,
        recipientIsInfo: d.recipient === "info@adeptfragrances.com",
        hasError: Boolean(d.error),
        errorHint: d.error ? String(d.error).slice(0, 120) : null,
        createdAt: d.createdAt,
      })),
    },
    null,
    2,
  ),
);
await prisma.$disconnect();
