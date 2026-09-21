import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "images", "adept");
mkdirSync(dir, { recursive: true });

const assets = [
  ["hero-fragrance-solutions", "Complete fragrance ecosystem"],
  ["fragrance-trading", "Fragrance trading"],
  ["packaging-components", "Packaging components"],
  ["toll-manufacturing", "Toll manufacturing"],
  ["private-label", "Private label"],
  ["perfume-bottles", "Perfume bottles"],
  ["caps", "Caps"],
  ["pumps-collars", "Pumps and collars"],
  ["labels-stickers", "Labels and stickers"],
  ["folding-cartons", "Folding cartons"],
  ["rigid-boxes", "Rigid boxes"],
  ["accessories", "Accessories"],
  ["complete-packaging-set", "Complete packaging set"],
  ["fragrance-oils", "Fragrance oils"],
  ["manufacturing-filling", "Filling"],
  ["manufacturing-mixing", "Mixing"],
  ["quality-control", "Quality control"],
  ["complete-brand-solution", "Complete brand solution"],
  ["industry-fine-fragrance", "Fine fragrance"],
  ["industry-personal-care", "Personal care"],
  ["industry-home-care", "Home care"],
  ["industry-candles", "Candles"],
];

const tones = ["#ECE7DE", "#E4DDD2", "#F4F1EB", "#DED6C8"];

function svg(title, i) {
  const bg = tones[i % tones.length];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img">
  <title>${title} — visual placeholder</title>
  <rect width="1600" height="1200" fill="${bg}"/>
  <rect x="80" y="80" width="1440" height="1040" fill="none" stroke="#17252B" stroke-opacity="0.08" stroke-width="1"/>
  <circle cx="1180" cy="320" r="180" fill="#B49A73" fill-opacity="0.12"/>
  <rect x="220" y="280" width="220" height="520" rx="110" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.12"/>
  <rect x="280" y="360" width="100" height="280" rx="8" fill="#B49A73" fill-opacity="0.35"/>
  <rect x="520" y="420" width="160" height="40" rx="4" fill="#17252B" fill-opacity="0.12"/>
  <rect x="520" y="490" width="280" height="18" rx="2" fill="#17252B" fill-opacity="0.08"/>
  <rect x="520" y="530" width="240" height="18" rx="2" fill="#17252B" fill-opacity="0.06"/>
  <rect x="900" y="640" width="420" height="280" fill="#ffffff" fill-opacity="0.45" stroke="#17252B" stroke-opacity="0.1"/>
  <text x="120" y="1080" font-family="Georgia, serif" font-size="36" fill="#17252B" fill-opacity="0.45">${title}</text>
  <text x="120" y="1120" font-family="system-ui,sans-serif" font-size="18" fill="#17252B" fill-opacity="0.35">ADEPT visual placeholder — replace with approved photography</text>
</svg>
`;
}

for (let i = 0; i < assets.length; i += 1) {
  const [name, title] = assets[i];
  writeFileSync(join(dir, `${name}.svg`), svg(title, i));
}
console.log(`wrote ${assets.length} placeholders to ${dir}`);
