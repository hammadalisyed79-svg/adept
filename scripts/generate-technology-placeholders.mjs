/**
 * Generate abstract Technology & Growth placeholders (SVG).
 * Not client photography; replace with approved assets when available.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "images", "adept");
mkdirSync(dir, { recursive: true });

function svg(title, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img">
  <title>${title} — ADEPT visual placeholder</title>
  <rect width="1600" height="1200" fill="#ECE7DE"/>
  <rect x="48" y="48" width="1504" height="1104" fill="none" stroke="#17252B" stroke-opacity="0.06" stroke-width="1"/>
  ${body}
  <text x="80" y="1120" font-family="Georgia, serif" font-size="28" fill="#17252B" fill-opacity="0.4">${title}</text>
  <text x="80" y="1155" font-family="system-ui,sans-serif" font-size="16" fill="#17252B" fill-opacity="0.28">Placeholder — replace with approved ADEPT imagery</text>
</svg>`;
}

const assets = [
  [
    "technology-growth",
    "Technology & Growth",
    `
    <rect x="220" y="280" width="420" height="520" rx="8" fill="#ffffff" fill-opacity="0.7" stroke="#17252B" stroke-opacity="0.1"/>
    <rect x="260" y="340" width="340" height="28" fill="#B49A73" fill-opacity="0.45"/>
    <rect x="260" y="400" width="280" height="16" fill="#17252B" fill-opacity="0.12"/>
    <rect x="260" y="440" width="300" height="16" fill="#17252B" fill-opacity="0.1"/>
    <rect x="260" y="500" width="160" height="160" fill="#17252B" fill-opacity="0.08"/>
    <rect x="450" y="500" width="160" height="160" fill="#B49A73" fill-opacity="0.25"/>
    <rect x="760" y="300" width="560" height="360" rx="8" fill="#17252B" fill-opacity="0.88"/>
    <rect x="800" y="360" width="200" height="120" fill="#B49A73" fill-opacity="0.5"/>
    <rect x="1040" y="360" width="200" height="120" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="800" y="520" width="480" height="18" fill="#ffffff" fill-opacity="0.2"/>
    <rect x="800" y="560" width="360" height="18" fill="#ffffff" fill-opacity="0.12"/>
    `,
  ],
  [
    "technology-erp",
    "ERP Solutions",
    `
    <rect x="280" y="240" width="1040" height="640" rx="10" fill="#ffffff" fill-opacity="0.75" stroke="#17252B" stroke-opacity="0.1"/>
    <rect x="280" y="240" width="220" height="640" fill="#17252B" fill-opacity="0.9"/>
    <rect x="310" y="300" width="160" height="14" fill="#B49A73" fill-opacity="0.55"/>
    <rect x="310" y="360" width="140" height="10" fill="#ffffff" fill-opacity="0.25"/>
    <rect x="310" y="400" width="150" height="10" fill="#ffffff" fill-opacity="0.2"/>
    <rect x="310" y="440" width="130" height="10" fill="#ffffff" fill-opacity="0.2"/>
    <rect x="560" y="300" width="280" height="160" fill="#ECE7DE"/>
    <rect x="880" y="300" width="280" height="160" fill="#ECE7DE"/>
    <rect x="560" y="500" width="600" height="280" fill="#F4F1EB" stroke="#17252B" stroke-opacity="0.06"/>
    <rect x="600" y="560" width="80" height="160" fill="#B49A73" fill-opacity="0.45"/>
    <rect x="720" y="620" width="80" height="100" fill="#17252B" fill-opacity="0.2"/>
    <rect x="840" y="540" width="80" height="180" fill="#B49A73" fill-opacity="0.3"/>
    <rect x="960" y="580" width="80" height="140" fill="#17252B" fill-opacity="0.15"/>
    `,
  ],
  [
    "technology-website",
    "Website Development",
    `
    <rect x="300" y="260" width="1000" height="620" rx="12" fill="#ffffff" fill-opacity="0.8" stroke="#17252B" stroke-opacity="0.1"/>
    <rect x="300" y="260" width="1000" height="64" fill="#17252B" fill-opacity="0.9"/>
    <circle cx="340" cy="292" r="8" fill="#B49A73" fill-opacity="0.7"/>
    <circle cx="370" cy="292" r="8" fill="#ffffff" fill-opacity="0.25"/>
    <circle cx="400" cy="292" r="8" fill="#ffffff" fill-opacity="0.25"/>
    <rect x="360" y="380" width="380" height="420" fill="#ECE7DE"/>
    <rect x="400" y="430" width="220" height="24" fill="#17252B" fill-opacity="0.2"/>
    <rect x="400" y="480" width="300" height="12" fill="#17252B" fill-opacity="0.1"/>
    <rect x="400" y="510" width="260" height="12" fill="#17252B" fill-opacity="0.08"/>
    <rect x="400" y="560" width="140" height="40" fill="#B49A73" fill-opacity="0.5"/>
    <rect x="780" y="380" width="440" height="200" fill="#F4F1EB" stroke="#17252B" stroke-opacity="0.06"/>
    <rect x="780" y="620" width="200" height="180" fill="#ECE7DE"/>
    <rect x="1020" y="620" width="200" height="180" fill="#ECE7DE"/>
    `,
  ],
  [
    "technology-marketing",
    "Digital Marketing",
    `
    <rect x="260" y="300" width="480" height="480" rx="8" fill="#ffffff" fill-opacity="0.75" stroke="#17252B" stroke-opacity="0.1"/>
    <circle cx="500" cy="480" r="120" fill="none" stroke="#B49A73" stroke-width="28" stroke-opacity="0.55"/>
    <circle cx="500" cy="480" r="60" fill="#17252B" fill-opacity="0.15"/>
    <rect x="820" y="280" width="460" height="140" rx="6" fill="#17252B" fill-opacity="0.88"/>
    <rect x="860" y="330" width="280" height="18" fill="#B49A73" fill-opacity="0.55"/>
    <rect x="820" y="460" width="460" height="140" rx="6" fill="#ffffff" fill-opacity="0.7" stroke="#17252B" stroke-opacity="0.08"/>
    <rect x="860" y="510" width="320" height="16" fill="#17252B" fill-opacity="0.12"/>
    <rect x="820" y="640" width="460" height="140" rx="6" fill="#ffffff" fill-opacity="0.7" stroke="#17252B" stroke-opacity="0.08"/>
    <rect x="860" y="690" width="240" height="16" fill="#17252B" fill-opacity="0.12"/>
    `,
  ],
];

for (const [file, title, body] of assets) {
  writeFileSync(join(dir, `${file}.svg`), svg(title, body));
  console.log("wrote", file);
}
