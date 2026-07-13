// Shared profile data + helpers for the banner card design (generate-banner.mjs).
// Both card generators read shared profile data from this file.

export const P = {
  handle: "alfonza1",
  name: "Alfonza",
  role: "Full-Stack Developer",
  company: "JPMorgan Chase",
  location: "Philadelphia, PA",
  birthday: "2000-02-25T00:00:00Z",
  tagline: "I build production-ready web apps, backend APIs & cloud workflows.",
  portfolio: "alfonza-dev.web.app",
  game: "playlastwords.com",
  stats: { repos: 43, commits: 468 },
  // badge row for the banner — [label, palette key], grouped by domain
  stack: [
    ["Java", "blue"], ["TypeScript", "blue"], ["Spring Boot", "green"], ["React", "green"],
    ["PostgreSQL", "cyan"], ["Kafka", "cyan"], ["AWS", "magenta"], ["Docker", "magenta"],
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

// GitHub-native palettes.
export const THEMES = {
  dark: {
    bg: "#0d1117", panel: "#010409", border: "#30363d", bar: "#161b22",
    text: "#e6edf3", dim: "#8b949e", green: "#3fb950", blue: "#58a6ff",
    yellow: "#d29922", red: "#f85149", magenta: "#bc8cff", cyan: "#39c5cf",
    grad1: "#4d9fff", grad2: "#39d353",
  },
  light: {
    bg: "#ffffff", panel: "#f6f8fa", border: "#d0d7de", bar: "#f6f8fa",
    text: "#1f2328", dim: "#59636e", green: "#1a7f37", blue: "#0969da",
    yellow: "#9a6700", red: "#cf222e", magenta: "#8250df", cyan: "#1b7c83",
    grad1: "#0969da", grad2: "#1a7f37",
  },
};

export const MONO =
  "'JetBrains Mono','SFMono-Regular',ui-monospace,'Cascadia Code',Consolas,'Liberation Mono',Menlo,monospace";
export const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
