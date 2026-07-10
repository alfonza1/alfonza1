// Shared profile data + helpers for the alternate card designs
// (generate-editor.mjs, generate-monitor.mjs). Design 1 (generate.mjs, the
// neofetch terminal) is self-contained. Edit here to update designs 2 & 3.

export const P = {
  handle: "alfonza1",
  name: "Alfonza",
  role: "Full-Stack Developer",
  company: "JPMorgan Chase",
  location: "Philadelphia, PA",
  os: "Windows 11 Pro · Linux",
  ide: "VS Code · IntelliJ · Claude Code",
  birthday: "2000-02-25T00:00:00Z",
  languages: ["Java", "TypeScript", "JavaScript", "SQL"],
  backend: ["Spring Boot", "PostgreSQL", "REST", "Microservices"],
  frontend: ["React", "Vite", "Tailwind", "HTML5 Canvas"],
  cloud: ["AWS", "Docker", "Cloud Run", "Kafka", "Jenkins"],
  practices: ["CI/CD", "Testing", "Observability", "Secure Auth"],
  projects: ["playlastwords.com", "incident-commander"],
  portfolio: "alfonza-dev.web.app",
  stats: { repos: 43, commits: 468 },
  // skill meters for the monitor design (label, percent 0-100)
  meters: [
    ["Java / Spring", 92],
    ["TypeScript / React", 88],
    ["Cloud / DevOps (AWS, Docker)", 80],
    ["SQL / PostgreSQL", 82],
    ["CI/CD & Testing", 85],
    ["System design", 78],
  ],
};

export function uptime(fromISO = P.birthday) {
  const a = new Date(fromISO), b = new Date();
  let y = b.getUTCFullYear() - a.getUTCFullYear();
  let m = b.getUTCMonth() - a.getUTCMonth();
  let d = b.getUTCDate() - a.getUTCDate();
  if (d < 0) { m -= 1; d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate(); }
  if (m < 0) { y -= 1; m += 12; }
  const p = (n, u) => `${n} ${u}${n === 1 ? "" : "s"}`;
  return `${p(y, "year")}, ${p(m, "month")}, ${p(d, "day")}`;
}

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// GitHub-native palettes, with syntax tokens for the editor design.
export const THEMES = {
  dark: {
    bg: "#0d1117", win: "#010409", border: "#30363d", bar: "#161b22",
    text: "#c9d1d9", dim: "#8b949e", green: "#3fb950", blue: "#58a6ff",
    yellow: "#d29922", red: "#f85149", magenta: "#bc8cff", cyan: "#39c5cf",
    // syntax
    kw: "#ff7b72", str: "#a5d6ff", prop: "#79c0ff", type: "#d2a8ff",
    num: "#79c0ff", punct: "#c9d1d9", comment: "#8b949e",
    track: "#21262d",
  },
  light: {
    bg: "#ffffff", win: "#f6f8fa", border: "#d0d7de", bar: "#f6f8fa",
    text: "#1f2328", dim: "#59636e", green: "#1a7f37", blue: "#0969da",
    yellow: "#9a6700", red: "#cf222e", magenta: "#8250df", cyan: "#1b7c83",
    kw: "#cf222e", str: "#0a3069", prop: "#0550ae", type: "#8250df",
    num: "#0550ae", punct: "#1f2328", comment: "#6e7781",
    track: "#eaeef2",
  },
};

export const FONT =
  "'JetBrains Mono','SFMono-Regular',ui-monospace,'Cascadia Code',Consolas,'Liberation Mono',Menlo,monospace";
