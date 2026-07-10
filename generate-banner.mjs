// Design 2 · BANNER — a hero card with an animated vector "A" monogram logo.
// The hexagon badge and the A stroke themselves in (stroke-dashoffset), a signal
// ring pulses, and the right-hand content fades in. Outputs banner_dark.svg +
// banner_light.svg.  Run:  node generate-banner.mjs   (data: profile.mjs)

import { writeFileSync } from "node:fs";
import { P, uptime, esc, THEMES, MONO, SANS } from "./profile.mjs";

const W = 860, H = 250;

// ---- logo geometry (pointy-top hexagon centred on the left) -----------------
const cx = 120, cy = 125, R = 66;
const hexPts = Array.from({ length: 6 }, (_, i) => {
  const a = (-90 + 60 * i) * Math.PI / 180;
  return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
});
const hexPath = "M" + hexPts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";
const HEX_LEN = Math.ceil(6 * R); // regular hexagon perimeter = 6·R

// the "A": two legs + a crossbar, drawn as one stroked path
const A = { apexX: cx, apexY: 88, blX: cx - 27, blY: 167, brX: cx + 27, brY: 167, clX: cx - 15, crX: cx + 15, barY: 138 };
const aPath =
  `M${A.blX} ${A.blY} L${A.apexX} ${A.apexY} L${A.brX} ${A.blY} ` +
  `M${A.clX} ${A.barY} L${A.crX} ${A.barY}`;
const A_LEN = 200;

// ---- right-hand content -----------------------------------------------------
const CX0 = 232;               // left edge of the content column
const CX_MAX = W - 26;         // right bound for wrapping badges

function build(t) {
  const upt = uptime();
  let d = 0;                                   // fade-in stagger index
  const rin = () => `class="rin" style="animation-delay:${(0.7 + d++ * 0.09).toFixed(2)}s"`;

  // badges — two rows of four, laid out by measured width
  const CHARW = 7.3, PADX = 14, BH = 26, GAP = 8;
  let rows = [[], []], x = [CX0, CX0];
  P.stack.forEach(([label, key], i) => {
    const r = i < 4 ? 0 : 1;
    const w = Math.round(label.length * CHARW + PADX * 2);
    rows[r].push({ label, key, x: x[r], w });
    x[r] += w + GAP;
  });
  const badgeTop = 150;
  let badges = "";
  rows.forEach((row, r) => {
    const yTop = badgeTop + r * (BH + 6);
    row.forEach((b, i) => {
      const c = t[b.key];
      badges +=
        `<g ${rin()}>` +
        `<rect x="${b.x}" y="${yTop}" width="${b.w}" height="${BH}" rx="${BH / 2}" ` +
        `fill="${c}" fill-opacity="0.13" stroke="${c}" stroke-opacity="0.4"/>` +
        `<text x="${b.x + b.w / 2}" y="${yTop + BH / 2 + 4.5}" text-anchor="middle" ` +
        `font-family="${SANS}" font-size="12.5" font-weight="600" fill="${c}">${esc(b.label)}</text>` +
        `</g>`;
    });
  });

  const meta =
    `<tspan fill="${t.dim}">${esc(P.location)}</tspan>` +
    `<tspan fill="${t.border}">   ·   </tspan>` +
    `<tspan fill="${t.dim}">up </tspan><tspan fill="${t.green}">${esc(upt)}</tspan>` +
    `<tspan fill="${t.border}">   ·   </tspan>` +
    `<tspan fill="${t.blue}">${P.stats.repos}</tspan><tspan fill="${t.dim}"> repos</tspan>` +
    `<tspan fill="${t.border}">   ·   </tspan>` +
    `<tspan fill="${t.blue}">${P.stats.commits}</tspan><tspan fill="${t.dim}"> commits</tspan>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Alfonza — Full-Stack Developer @ JPMorgan Chase">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.grad1}"/>
      <stop offset="1" stop-color="${t.grad2}"/>
    </linearGradient>
  </defs>
  <style>
    .draw { fill: none; stroke: url(#g); stroke-linecap: round; stroke-linejoin: round; }
    .hex  { stroke-width: 3.5; stroke-dasharray: ${HEX_LEN}; stroke-dashoffset: ${HEX_LEN};
            animation: draw 1.2s ease forwards 0.15s; }
    .mono { stroke-width: 9; stroke-dasharray: ${A_LEN}; stroke-dashoffset: ${A_LEN};
            animation: draw 0.9s ease forwards 0.95s; }
    .fill { opacity: 0; animation: fade 0.9s ease forwards 0.35s; }
    .ring { fill: none; stroke: url(#g); stroke-width: 2; transform-box: fill-box;
            transform-origin: center; opacity: 0; animation: pulse 3.4s ease-out infinite 1.7s; }
    .rin  { opacity: 0; animation: rin 0.5s ease forwards; }
    @keyframes draw  { to { stroke-dashoffset: 0; } }
    @keyframes fade  { to { opacity: 1; } }
    @keyframes rin   { from { opacity: 0; transform: translateX(9px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.45; } 100% { transform: scale(1.55); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) {
      .hex,.mono { stroke-dashoffset: 0; animation: none; }
      .fill,.rin { opacity: 1; animation: none; } .ring { display: none; }
    }
  </style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>

  <!-- logo -->
  <path class="draw ring" d="${hexPath}"/>
  <path class="fill" d="${hexPath}" fill="url(#g)" fill-opacity="0.08" stroke="none"/>
  <path class="draw hex" d="${hexPath}"/>
  <path class="draw mono" d="${aPath}"/>

  <!-- divider -->
  <line class="fill" x1="208" y1="52" x2="208" y2="198" stroke="${t.border}" stroke-width="1"/>

  <!-- name + handle -->
  <text x="${CX0}" y="78" font-family="${SANS}" font-size="33" font-weight="800" fill="${t.text}" ${rin()}>Alfonza</text>
  <circle cx="${CX0 + 152}" cy="70" r="4" fill="${t.green}" ${rin()}/>
  <text x="${CX0 + 163}" y="75" font-family="${MONO}" font-size="14" fill="${t.dim}" ${rin()}>@${P.handle}</text>

  <!-- role -->
  <text x="${CX0}" y="104" font-family="${SANS}" font-size="15" ${rin()}>
    <tspan fill="${t.blue}" font-weight="700">${esc(P.role)}</tspan><tspan fill="${t.dim}"> @ ${esc(P.company)}</tspan>
  </text>

  <!-- tagline -->
  <text x="${CX0}" y="128" font-family="${SANS}" font-size="13.5" fill="${t.dim}" ${rin()}>${esc(P.tagline)}</text>

  <!-- badges -->
  ${badges}

  <!-- meta -->
  <text x="${CX0}" y="222" font-family="${MONO}" font-size="12.5" ${rin()}>${meta}</text>
</svg>
`;
}

writeFileSync("banner_dark.svg", build(THEMES.dark));
writeFileSync("banner_light.svg", build(THEMES.light));
console.log("wrote banner_dark.svg + banner_light.svg  (uptime:", uptime() + ")");
