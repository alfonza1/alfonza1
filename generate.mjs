// Generates dark_mode.svg + light_mode.svg — an animated "neofetch" terminal
// GitHub profile card for @alfonza1. Uptime is recomputed on every run.
//
//   node generate.mjs
//
// Stats (repos/commits) are baked in STATS below; refresh them with:
//   gh api graphql -f query='{ viewer { ... } }'
// Everything else is hand-authored profile content.

import { writeFileSync } from "node:fs";
import { P, uptime } from "./profile.mjs";

// ---- profile data -----------------------------------------------------------
// "Uptime" counts from birth (the neofetch meme) — recomputed on every run.
const STATS = { repos: 43, commits: 468 };

const INFO = [
  ["header", "alfonza1", "@github"],
  ["rule", 24],
  ["kv", "OS", "Windows 11 Pro · Linux"],
  ["kv", "Host", "Philadelphia, PA"],
  ["kv", "Kernel", "Full-Stack Developer @ JPMorgan Chase"],
  ["kv", "Uptime", "%UPTIME%"],
  ["kv", "IDE", "VS Code · IntelliJ IDEA · Claude Code"],
  ["gap"],
  ["kv", "Languages", "Java · TypeScript · JavaScript · SQL"],
  ["kv", "Backend", "Spring Boot · REST · Microservices · PostgreSQL · Firebase/JWT"],
  ["kv", "Frontend", "React · Vite · Tailwind · HTML5 Canvas · Responsive UI"],
  ["kv", "Cloud", "AWS · Docker · Cloud Run · Kafka · Actions · Jenkins · Spinnaker"],
  ["kv", "Practices", "CI/CD · Automated testing · Observability · Sentry · Secure auth"],
  ["kv", "Hobbies", "Shipping small products fast · AI apps · Game dev"],
  ["gap"],
  ["kv", "Projects", "playlastwords.com"],
  ["kv", "Portfolio", "alfonza-dev.web.app"],
  ["gap"],
  ["header2", "Contributions"],
  ["rule", 13],
  ["stat", "Repos", STATS.repos, "Commits", STATS.commits],
  ["gap"],
  ["palette"],
];

// ASCII "A" monogram (aligns in any monospace font).
const ART = [
  "        /\\",
  "       /  \\",
  "      / /\\ \\",
  "     / /  \\ \\",
  "    / /    \\ \\",
  "   / /  /\\  \\ \\",
  "  / /  /  \\  \\ \\",
  " / /  /____\\  \\ \\",
  "/_/  /______\\  \\_\\",
  "     \\/     \\/",
  "",
  "  a l f o n z a",
];

// ---- themes -----------------------------------------------------------------
const THEMES = {
  dark: {
    bg: "#0d1117", win: "#010409", border: "#30363d", bar: "#161b22",
    text: "#c9d1d9", dim: "#8b949e", green: "#3fb950", blue: "#58a6ff",
    yellow: "#d29922", red: "#f85149", magenta: "#bc8cff", cyan: "#39c5cf", art: "#58a6ff",
  },
  light: {
    bg: "#ffffff", win: "#f6f8fa", border: "#d0d7de", bar: "#f6f8fa",
    text: "#1f2328", dim: "#59636e", green: "#1a7f37", blue: "#0969da",
    yellow: "#9a6700", red: "#cf222e", magenta: "#8250df", cyan: "#1b7c83", art: "#0969da",
  },
};

// ---- helpers ----------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---- svg builder ------------------------------------------------------------
function build(t) {
  const PAD = 26, BAR = 40, LH = 19, FS = 14;
  const artX = PAD + 6, infoX = 250;
  const top = BAR + 30;
  const rows = INFO.length;
  const H = top + rows * LH + 24;
  const W = 928;
  const upt = uptime(P.birthday);

  let defs = 0; // stagger index for the reveal animation
  const delay = () => (0.5 + defs++ * 0.14).toFixed(2);

  const line = (y, inner, d) =>
    `<text x="${infoX}" y="${y}" class="ln" style="animation-delay:${d}s">${inner}</text>`;

  // info rows -----------------------------------------------------------------
  let infoSvg = "";
  INFO.forEach((row, i) => {
    const y = top + i * LH + FS;
    const d = delay();
    if (row[0] === "header")
      infoSvg += line(y, `<tspan fill="${t.green}" font-weight="700">${esc(row[1])}</tspan><tspan fill="${t.dim}">${esc(row[2])}</tspan>`, d);
    else if (row[0] === "header2")
      infoSvg += line(y, `<tspan fill="${t.green}" font-weight="700">${esc(row[1])}</tspan>`, d);
    else if (row[0] === "rule")
      infoSvg += line(y, `<tspan fill="${t.dim}">${"─".repeat(row[1])}</tspan>`, d);
    else if (row[0] === "kv")
      infoSvg += line(y, `<tspan fill="${t.blue}" font-weight="600">${esc(row[1])}</tspan><tspan fill="${t.dim}">: </tspan><tspan fill="${t.text}">${esc(row[2].replace("%UPTIME%", upt))}</tspan>`, d);
    else if (row[0] === "stat")
      infoSvg += line(y,
        `<tspan fill="${t.blue}" font-weight="600">${esc(row[1])}</tspan><tspan fill="${t.dim}">: </tspan><tspan fill="${t.yellow}">${esc(row[2])}</tspan>` +
        `<tspan fill="${t.dim}">   </tspan>` +
        `<tspan fill="${t.blue}" font-weight="600">${esc(row[3])}</tspan><tspan fill="${t.dim}">: </tspan><tspan fill="${t.yellow}">${esc(row[4])}</tspan>`, d);
    else if (row[0] === "palette") {
      const cols = [t.red, t.yellow, t.green, t.cyan, t.blue, t.magenta, t.text, t.dim];
      let sq = "";
      cols.forEach((c, k) => (sq += `<rect x="${infoX + k * 22}" y="${y - 12}" width="16" height="16" rx="3" fill="${c}"/>`));
      infoSvg += `<g class="ln" style="animation-delay:${d}s">${sq}</g>`;
    }
    // "gap" → nothing
  });

  // art -----------------------------------------------------------------------
  let artSvg = "";
  ART.forEach((l, i) => {
    const y = top + i * LH + FS;
    const cls = i === ART.length - 1 ? t.green : t.art;
    artSvg += `<text x="${artX}" y="${y}" xml:space="preserve" fill="${cls}" font-weight="700" class="ln" style="animation-delay:${(0.15 + i * 0.05).toFixed(2)}s">${esc(l)}</text>`;
  });

  // prompt + cursor -----------------------------------------------------------
  const promptY = BAR + 18;
  const prompt =
    `<text x="${PAD}" y="${promptY}" class="ln" style="animation-delay:0.1s">` +
    `<tspan fill="${t.green}" font-weight="700">alfonza1</tspan>` +
    `<tspan fill="${t.dim}">@github</tspan><tspan fill="${t.text}">:</tspan>` +
    `<tspan fill="${t.blue}">~</tspan><tspan fill="${t.text}">$ neofetch</tspan></text>`;
  const cursorY = top + rows * LH + FS - LH;
  const cursor = `<rect x="${infoX}" y="${cursorY - 12}" width="9" height="16" rx="1" fill="${t.green}" class="cursor"/>`;

  const dots = [t.red, t.yellow, t.green]
    .map((c, i) => `<circle cx="${PAD + i * 20}" cy="20" r="6" fill="${c}"/>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="alfonza1 GitHub profile">
  <style>
    text { font-family: 'JetBrains Mono','SFMono-Regular',ui-monospace,'Cascadia Code',Consolas,'Liberation Mono',Menlo,monospace; font-size: ${FS}px; }
    .ln { opacity: 0; animation: appear 0.32s ease forwards; }
    @keyframes appear { from { opacity: 0; } to { opacity: 1; } }
    .cursor { animation: blink 1.1s steps(1) infinite; animation-delay: 3.6s; opacity: 0; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .ln { opacity: 1; animation: none; } .cursor { opacity: 1; animation: none; } }
  </style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="10" fill="${t.bg}" stroke="${t.border}" stroke-width="1.5"/>
  <path d="M1 11 a10 10 0 0 1 10 -10 h${W - 22} a10 10 0 0 1 10 10 v29 h-${W - 2} z" fill="${t.bar}"/>
  <line x1="1" y1="40" x2="${W - 1}" y2="40" stroke="${t.border}" stroke-width="1"/>
  ${dots}
  <text x="${W / 2}" y="25" text-anchor="middle" fill="${t.dim}" font-size="12">alfonza1@github: ~</text>
  ${prompt}
  ${artSvg}
  ${infoSvg}
  ${cursor}
</svg>
`;
}

writeFileSync("dark_mode.svg", build(THEMES.dark));
writeFileSync("light_mode.svg", build(THEMES.light));
console.log("wrote dark_mode.svg + light_mode.svg  (uptime:", uptime(P.birthday) + ")");
