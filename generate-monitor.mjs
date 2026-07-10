// Design 3 — "system monitor" card: a btop/htop-style panel with animated
// skill-load bars, a status line, live uptime, and repo/commit readouts.
// Outputs monitor_dark.svg / monitor_light.svg.

import { writeFileSync } from "node:fs";
import { P, THEMES, uptime, esc, FONT } from "./profile.mjs";

function build(t) {
  const W = 840, BAR = 40;
  const cycle = [t.green, t.cyan, t.blue, t.magenta, t.yellow, t.green];

  // layout anchors
  const padX = 28;
  const trackX = 322, trackW = W - trackX - 96, rowH = 34;
  const barsTop = 150;
  const H = barsTop + P.meters.length * rowH + 62;

  const dots = [t.red, t.yellow, t.green].map((c, i) => `<circle cx="${20 + i * 20}" cy="20" r="6" fill="${c}"/>`).join("");

  // status + uptime header
  const header =
    `<text x="${padX}" y="72" class="ln" style="animation-delay:.15s"><tspan fill="${t.green}">●</tspan>` +
    `<tspan fill="${t.text}" font-weight="700">  alfonza1</tspan>` +
    `<tspan fill="${t.dim}">  ${esc(P.role)} @ ${esc(P.company)}</tspan></text>` +
    `<text x="${W - padX}" y="72" text-anchor="end" fill="${t.dim}" class="ln" style="animation-delay:.15s">${esc(P.location)}</text>` +
    `<text x="${padX}" y="102" class="ln" style="animation-delay:.3s"><tspan fill="${t.blue}" font-weight="600">uptime</tspan>` +
    `<tspan fill="${t.dim}">  </tspan><tspan fill="${t.text}">${esc(uptime())}</tspan>` +
    `<tspan fill="${t.dim}">   ·   </tspan><tspan fill="${t.blue}" font-weight="600">repos</tspan><tspan fill="${t.dim}"> </tspan><tspan fill="${t.yellow}">${P.stats.repos}</tspan>` +
    `<tspan fill="${t.dim}">   ·   </tspan><tspan fill="${t.blue}" font-weight="600">commits</tspan><tspan fill="${t.dim}"> </tspan><tspan fill="${t.yellow}">${P.stats.commits}</tspan></text>` +
    `<text x="${padX}" y="134" fill="${t.dim}" font-size="12" letter-spacing="1.5" class="ln" style="animation-delay:.4s">SKILL LOAD</text>`;

  // animated bars
  let bars = "";
  P.meters.forEach(([label, pct], i) => {
    const y = barsTop + i * rowH;
    const fillW = Math.round((trackW * pct) / 100);
    const col = cycle[i % cycle.length];
    const delay = (0.5 + i * 0.14).toFixed(2);
    bars +=
      `<g class="ln" style="animation-delay:${delay}s">` +
      `<text x="${padX}" y="${y + 13}" fill="${t.text}">${esc(label)}</text>` +
      `<rect x="${trackX}" y="${y + 2}" width="${trackW}" height="14" rx="4" fill="${t.track}"/>` +
      `<rect x="${trackX}" y="${y + 2}" width="${fillW}" height="14" rx="4" fill="${col}" class="bar" style="animation-delay:${delay}s"/>` +
      `<text x="${W - padX}" y="${y + 13}" text-anchor="end" fill="${t.dim}">${pct}%</text>` +
      `</g>`;
  });

  const fy = barsTop + P.meters.length * rowH + 30;
  const footer =
    `<text x="${padX}" y="${fy}" class="ln" style="animation-delay:1.5s">` +
    `<tspan fill="${t.magenta}" font-weight="600">projects</tspan><tspan fill="${t.dim}">  ${esc(P.projects.join("  ·  "))}</tspan></text>` +
    `<text x="${W - padX}" y="${fy}" text-anchor="end" fill="${t.dim}" class="ln" style="animation-delay:1.5s">${esc(P.portfolio)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="alfonza1 — skills monitor">
  <style>
    text { font-family: ${FONT}; font-size: 14px; }
    .ln { opacity: 0; animation: appear .35s ease forwards; }
    @keyframes appear { to { opacity: 1; } }
    .bar { transform: scaleX(0); transform-origin: left center; transform-box: fill-box; animation: grow 1.1s cubic-bezier(.2,.8,.2,1) forwards; }
    @keyframes grow { to { transform: scaleX(1); } }
    @media (prefers-reduced-motion: reduce){ .ln{opacity:1;animation:none;} .bar{transform:none;animation:none;} }
  </style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="10" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>
  <path d="M1 11 a10 10 0 0 1 10 -10 h${W - 22} a10 10 0 0 1 10 10 v29 h-${W - 2} z" fill="${t.bar}"/>
  <line x1="1" y1="40" x2="${W - 1}" y2="40" stroke="${t.border}"/>
  ${dots}
  <text x="${W / 2}" y="25" text-anchor="middle" fill="${t.dim}" font-size="12">btop — alfonza1@github</text>
  ${header}${bars}${footer}
</svg>
`;
}

writeFileSync("monitor_dark.svg", build(THEMES.dark));
writeFileSync("monitor_light.svg", build(THEMES.light));
console.log("wrote monitor_dark.svg + monitor_light.svg");
