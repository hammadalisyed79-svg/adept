/**
 * Generate distinct ADEPT visual placeholders (not facility photos).
 * Each asset uses a fragrance/packaging-appropriate composition.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "images", "adept");
mkdirSync(dir, { recursive: true });

const bg = ["#ECE7DE", "#E8E1D6", "#F4F1EB", "#E2DACF", "#F0EBE3"];

function frame(title, body, i) {
  const fill = bg[i % bg.length];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img">
  <title>${title} — ADEPT visual placeholder</title>
  <rect width="1600" height="1200" fill="${fill}"/>
  <rect x="48" y="48" width="1504" height="1104" fill="none" stroke="#17252B" stroke-opacity="0.06" stroke-width="1"/>
  ${body}
  <text x="80" y="1120" font-family="Georgia, serif" font-size="28" fill="#17252B" fill-opacity="0.4">${title}</text>
  <text x="80" y="1155" font-family="system-ui,sans-serif" font-size="16" fill="#17252B" fill-opacity="0.28">Placeholder — replace with approved ADEPT photography</text>
</svg>`;
}

function bottle(x, y, w, h, liquid = "#B49A73", liquidOp = "0.45") {
  const neckW = w * 0.28;
  const neckH = h * 0.18;
  const bodyY = y + neckH;
  const bodyH = h - neckH;
  return `
  <rect x="${x + (w - neckW) / 2}" y="${y}" width="${neckW}" height="${neckH}" fill="#ffffff" fill-opacity="0.7" stroke="#17252B" stroke-opacity="0.12"/>
  <rect x="${x}" y="${bodyY}" width="${w}" height="${bodyH}" rx="${w * 0.12}" fill="#ffffff" fill-opacity="0.65" stroke="#17252B" stroke-opacity="0.12"/>
  <rect x="${x + w * 0.18}" y="${bodyY + bodyH * 0.28}" width="${w * 0.64}" height="${bodyH * 0.52}" rx="6" fill="${liquid}" fill-opacity="${liquidOp}"/>`;
}

function cap(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.15}" fill="#17252B" fill-opacity="0.55"/>`;
}

function pump(x, y) {
  return `
  <rect x="${x}" y="${y}" width="28" height="90" rx="4" fill="#17252B" fill-opacity="0.35"/>
  <rect x="${x - 18}" y="${y + 90}" width="64" height="22" rx="3" fill="#B49A73" fill-opacity="0.5"/>
  <rect x="${x - 8}" y="${y - 18}" width="44" height="18" rx="2" fill="#17252B" fill-opacity="0.4"/>`;
}

function box(x, y, w, h) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.12"/>
  <line x1="${x}" y1="${y + 36}" x2="${x + w}" y2="${y + 36}" stroke="#17252B" stroke-opacity="0.08"/>
  <rect x="${x + w * 0.2}" y="${y + h * 0.35}" width="${w * 0.6}" height="10" fill="#B49A73" fill-opacity="0.35"/>`;
}

function vial(x, y) {
  return `
  <rect x="${x}" y="${y}" width="70" height="200" rx="8" fill="#ffffff" fill-opacity="0.6" stroke="#17252B" stroke-opacity="0.12"/>
  <rect x="${x + 10}" y="${y + 70}" width="50" height="110" fill="#B49A73" fill-opacity="0.5"/>
  <rect x="${x + 18}" y="${y - 24}" width="34" height="24" fill="#17252B" fill-opacity="0.4"/>`;
}

function blotter(x, y) {
  return `<rect x="${x}" y="${y}" width="18" height="140" rx="2" fill="#ffffff" fill-opacity="0.85" stroke="#17252B" stroke-opacity="0.1" transform="rotate(-12 ${x} ${y})"/>`;
}

const assets = [
  [
    "hero-fragrance-solutions",
    "Complete fragrance ecosystem",
    [
      bottle(280, 260, 160, 520),
      cap(520, 300, 100, 90),
      pump(720, 340),
      vial(880, 380),
      box(1080, 520, 320, 280),
      `<rect x="520" y="460" width="140" height="90" rx="4" fill="#ffffff" fill-opacity="0.5" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<text x="540" y="512" font-family="system-ui,sans-serif" font-size="14" fill="#17252B" fill-opacity="0.35">LABEL</text>`,
    ].join("\n"),
  ],
  [
    "fragrance-trading",
    "Fragrance trading",
    [vial(420, 320), vial(560, 360), vial(700, 300), blotter(920, 380), blotter(980, 400), blotter(1040, 360)].join(
      "\n",
    ),
  ],
  [
    "packaging-components",
    "Packaging components",
    [bottle(360, 280, 140, 480), cap(620, 320, 110, 100), pump(820, 360), box(1000, 560, 280, 240)].join("\n"),
  ],
  [
    "toll-manufacturing",
    "Toll manufacturing (illustrative)",
    [
      `<ellipse cx="520" cy="720" rx="180" ry="40" fill="#17252B" fill-opacity="0.06"/>`,
      `<rect x="380" y="340" width="280" height="380" rx="20" fill="#ffffff" fill-opacity="0.45" stroke="#17252B" stroke-opacity="0.12"/>`,
      `<rect x="420" y="420" width="200" height="260" rx="8" fill="#B49A73" fill-opacity="0.2"/>`,
      `<rect x="780" y="400" width="220" height="300" rx="12" fill="#ffffff" fill-opacity="0.4" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<rect x="1080" y="480" width="160" height="220" rx="8" fill="#ffffff" fill-opacity="0.5" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<text x="400" y="300" font-family="system-ui,sans-serif" font-size="18" fill="#17252B" fill-opacity="0.3">Illustrative process — not a verified ADEPT facility</text>`,
    ].join("\n"),
  ],
  [
    "private-label",
    "Private label",
    [bottle(480, 260, 150, 500), cap(515, 200, 80, 70), box(780, 420, 360, 360)].join("\n"),
  ],
  [
    "perfume-bottles",
    "Perfume bottles",
    [
      bottle(380, 240, 150, 560),
      bottle(620, 300, 130, 480),
      bottle(840, 260, 170, 540, "#8F7854", "0.35"),
    ].join("\n"),
  ],
  [
    "caps",
    "Caps",
    [cap(420, 400, 140, 120), cap(640, 380, 160, 160), cap(900, 420, 120, 100), cap(1100, 400, 150, 130)].join(
      "\n",
    ),
  ],
  [
    "pumps-collars",
    "Pumps and collars",
    [
      pump(520, 360),
      pump(720, 340),
      pump(920, 380),
      `<ellipse cx="540" cy="520" rx="50" ry="14" fill="#B49A73" fill-opacity="0.35"/>`,
      `<ellipse cx="740" cy="500" rx="50" ry="14" fill="#B49A73" fill-opacity="0.35"/>`,
    ].join("\n"),
  ],
  [
    "labels-stickers",
    "Labels and stickers",
    [
      `<rect x="360" y="340" width="280" height="160" rx="4" fill="#ffffff" fill-opacity="0.7" stroke="#17252B" stroke-opacity="0.12"/>`,
      `<rect x="720" y="380" width="240" height="140" rx="4" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<rect x="1020" y="360" width="220" height="180" rx="4" fill="#B49A73" fill-opacity="0.2" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<rect x="400" y="400" width="160" height="12" fill="#17252B" fill-opacity="0.15"/>`,
      `<rect x="400" y="430" width="120" height="8" fill="#17252B" fill-opacity="0.08"/>`,
    ].join("\n"),
  ],
  [
    "folding-cartons",
    "Folding cartons",
    [box(420, 360, 280, 360), box(760, 400, 240, 320), box(1060, 380, 260, 340)].join("\n"),
  ],
  [
    "rigid-boxes",
    "Rigid boxes",
    [box(400, 320, 360, 420), box(860, 380, 320, 360)].join("\n"),
  ],
  [
    "accessories",
    "Accessories",
    [
      `<circle cx="480" cy="520" r="70" fill="#B49A73" fill-opacity="0.25" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<rect x="640" y="420" width="40" height="220" rx="4" fill="#17252B" fill-opacity="0.2"/>`,
      `<rect x="760" y="460" width="180" height="140" rx="8" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<rect x="1020" y="440" width="160" height="180" rx="6" fill="#ffffff" fill-opacity="0.5" stroke="#17252B" stroke-opacity="0.1"/>`,
    ].join("\n"),
  ],
  [
    "complete-packaging-set",
    "Complete packaging set",
    [bottle(420, 280, 140, 480), cap(455, 220, 70, 60), box(700, 400, 300, 320), pump(1100, 360)].join("\n"),
  ],
  [
    "fragrance-oils",
    "Fragrance oils",
    [vial(400, 300), vial(540, 340), vial(680, 280), blotter(900, 360), blotter(960, 380)].join("\n"),
  ],
  [
    "manufacturing-filling",
    "Filling (illustrative)",
    [
      `<text x="80" y="120" font-family="system-ui,sans-serif" font-size="18" fill="#17252B" fill-opacity="0.3">Illustrative — not a verified ADEPT facility</text>`,
      bottle(560, 300, 120, 400),
      `<rect x="800" y="360" width="200" height="280" rx="8" fill="#ffffff" fill-opacity="0.45" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<line x1="700" y1="340" x2="800" y2="420" stroke="#B49A73" stroke-opacity="0.5" stroke-width="4"/>`,
    ].join("\n"),
  ],
  [
    "manufacturing-mixing",
    "Mixing (illustrative)",
    [
      `<text x="80" y="120" font-family="system-ui,sans-serif" font-size="18" fill="#17252B" fill-opacity="0.3">Illustrative — not a verified ADEPT facility</text>`,
      `<ellipse cx="800" cy="700" rx="220" ry="50" fill="#17252B" fill-opacity="0.06"/>`,
      `<rect x="620" y="280" width="360" height="420" rx="24" fill="#ffffff" fill-opacity="0.45" stroke="#17252B" stroke-opacity="0.12"/>`,
      `<rect x="680" y="380" width="240" height="280" rx="12" fill="#B49A73" fill-opacity="0.22"/>`,
    ].join("\n"),
  ],
  [
    "quality-control",
    "Quality control (illustrative)",
    [
      `<text x="80" y="120" font-family="system-ui,sans-serif" font-size="18" fill="#17252B" fill-opacity="0.3">Illustrative — not a verified ADEPT facility</text>`,
      bottle(520, 300, 130, 420),
      `<rect x="780" y="360" width="320" height="240" rx="6" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.1"/>`,
      `<rect x="820" y="420" width="200" height="10" fill="#17252B" fill-opacity="0.12"/>`,
      `<rect x="820" y="460" width="160" height="8" fill="#17252B" fill-opacity="0.08"/>`,
      `<rect x="820" y="500" width="180" height="8" fill="#17252B" fill-opacity="0.08"/>`,
    ].join("\n"),
  ],
  [
    "complete-brand-solution",
    "Complete brand solution",
    [
      vial(280, 400),
      bottle(420, 280, 140, 480),
      pump(640, 340),
      cap(780, 300, 90, 80),
      box(980, 480, 300, 280),
      `<rect x="780" y="420" width="120" height="70" rx="3" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.1"/>`,
    ].join("\n"),
  ],
  [
    "industry-fine-fragrance",
    "Fine fragrance",
    [bottle(560, 240, 160, 560), cap(595, 180, 90, 70)].join("\n"),
  ],
  [
    "industry-personal-care",
    "Personal care",
    [bottle(480, 300, 120, 400), bottle(700, 340, 140, 360, "#C9B597", "0.35")].join("\n"),
  ],
  [
    "industry-home-care",
    "Home care",
    [
      `<rect x="520" y="320" width="200" height="420" rx="20" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.12"/>`,
      `<rect x="800" y="360" width="180" height="380" rx="16" fill="#ffffff" fill-opacity="0.5" stroke="#17252B" stroke-opacity="0.1"/>`,
    ].join("\n"),
  ],
  [
    "industry-candles",
    "Candles",
    [
      `<ellipse cx="700" cy="700" rx="120" ry="30" fill="#17252B" fill-opacity="0.06"/>`,
      `<rect x="620" y="400" width="160" height="280" rx="8" fill="#ffffff" fill-opacity="0.55" stroke="#17252B" stroke-opacity="0.12"/>`,
      `<path d="M700 320 L720 400 L680 400 Z" fill="#B49A73" fill-opacity="0.45"/>`,
    ].join("\n"),
  ],
];

for (let i = 0; i < assets.length; i += 1) {
  const [name, title, body] = assets[i];
  writeFileSync(join(dir, `${name}.svg`), frame(title, body, i));
}
console.log(`wrote ${assets.length} composition placeholders to ${dir}`);
