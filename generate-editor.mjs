// Design 2 — "code editor" card: a syntax-highlighted TypeScript object in a
// VS Code-style window with a filename tab, line-number gutter, reveal
// animation, and a blinking cursor.  Outputs editor_dark.svg / editor_light.svg.

import { writeFileSync } from "node:fs";
import { P, THEMES, uptime, esc, FONT } from "./profile.mjs";

const KEYW = 9; // key column width for value alignment

const pad = (key) => ":" + " ".repeat(Math.max(1, KEYW - key.length + 1));
const scalar = (key, val) => [
  ["punct", "  "], ["prop", key], ["punct", pad(key)], ["str", `"${val}"`], ["punct", ","],
];
const arr = (key, items) => {
  const t = [["punct", "  "], ["prop", key], ["punct", pad(key)], ["punct", "["]];
  items.forEach((it, i) => { t.push(["str", `"${it}"`]); if (i < items.length - 1) t.push(["punct", ", "]); });
  t.push(["punct", "]"], ["punct", ","]);
  return t;
};

function lines() {
  return [
    [["comment", "// full-stack developer @ " + P.company]],
    [["kw", "const"], ["text", " alfonza "], ["punct", "= {"]],
    scalar("role", P.role),
    scalar("location", P.location),
    scalar("uptime", uptime()),
    arr("languages", P.languages),
    arr("backend", P.backend),
    arr("frontend", P.frontend),
    arr("cloud", P.cloud),
    arr("practices", P.practices),
    arr("projects", P.projects),
    scalar("portfolio", P.portfolio),
    [["punct", "} "], ["kw", "satisfies"], ["type", " Developer"]],
  ];
}

function build(t) {
  const L = lines();
  const BAR = 40, LH = 22, FS = 14.5, GUT = 54, codeX = GUT + 14, top = BAR + 26;
  const W = 820, H = top + L.length * LH + 20;

  const color = (c) => t[c] ?? t.text;

  // window + tab bar
  const dots = [t.red, t.yellow, t.green].map((c, i) => `<circle cx="${20 + i * 20}" cy="20" r="6" fill="${c}"/>`).join("");
  const tab =
    `<rect x="150" y="8" width="140" height="32" rx="6" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>` +
    `<rect x="162" y="19" width="10" height="10" rx="2" fill="${t.blue}"/>` +
    `<text x="180" y="27" fill="${t.text}" font-size="12.5">alfonza.ts</text>` +
    `<circle cx="278" cy="24" r="3.5" fill="${t.dim}"/>`;

  // gutter + code
  let body = "", d = 0;
  L.forEach((toks, i) => {
    const y = top + i * LH + FS;
    const delay = (0.25 + d++ * 0.13).toFixed(2);
    body += `<text x="${GUT - 12}" y="${y}" text-anchor="end" fill="${t.dim}" font-size="12.5" class="ln" style="animation-delay:${delay}s">${i + 1}</text>`;
    const spans = toks.map(([c, s]) => `<tspan fill="${color(c)}"${c === "kw" || c === "prop" ? ' font-weight="600"' : ""}>${esc(s)}</tspan>`).join("");
    body += `<text x="${codeX}" y="${y}" xml:space="preserve" class="ln" style="animation-delay:${delay}s">${spans}</text>`;
  });

  const cy = top + (L.length - 1) * LH + FS;
  const cursor = `<rect x="${codeX + 132}" y="${cy - 12}" width="8" height="16" rx="1" fill="${t.text}" class="cursor"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="alfonza1 — developer profile">
  <style>
    text { font-family: ${FONT}; font-size: ${FS}px; }
    .ln { opacity: 0; animation: appear .3s ease forwards; }
    @keyframes appear { to { opacity: 1; } }
    .cursor { opacity: 0; animation: blink 1.1s steps(1) infinite; animation-delay: 2.4s; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    @media (prefers-reduced-motion: reduce){ .ln,.cursor{opacity:1;animation:none;} }
  </style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="10" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>
  <path d="M1 11 a10 10 0 0 1 10 -10 h${W - 22} a10 10 0 0 1 10 10 v29 h-${W - 2} z" fill="${t.bar}"/>
  <line x1="1" y1="40" x2="${W - 1}" y2="40" stroke="${t.border}"/>
  <rect x="${GUT}" y="41" width="1" height="${H - 42}" fill="${t.border}"/>
  ${dots}${tab}${body}${cursor}
</svg>
`;
}

writeFileSync("editor_dark.svg", build(THEMES.dark));
writeFileSync("editor_light.svg", build(THEMES.light));
console.log("wrote editor_dark.svg + editor_light.svg");
