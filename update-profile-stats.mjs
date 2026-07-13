import { readFileSync, writeFileSync } from "node:fs";

const PROFILE_PATH = new URL("./profile.mjs", import.meta.url);
const GITHUB_API_URL = process.env.GITHUB_API_URL || "https://api.github.com";
const GITHUB_HANDLE = "alfonza1";
const STATS_PATTERN = /stats: \{ repos: \d+, commits: \d+ \}/;

function requestHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": `${GITHUB_HANDLE}-profile-stats`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function githubJson(path) {
  const response = await fetch(`${GITHUB_API_URL}${path}`, { headers: requestHeaders() });
  if (!response.ok) throw new Error(`GitHub API request failed (${response.status}) for ${path}`);
  return response.json();
}

function requireCount(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`GitHub returned an invalid ${label} count`);
  return value;
}

async function fetchPublicStats() {
  const query = encodeURIComponent(`author:${GITHUB_HANDLE}`);
  const [user, commits] = await Promise.all([
    githubJson(`/users/${GITHUB_HANDLE}`),
    githubJson(`/search/commits?q=${query}&per_page=1`),
  ]);
  if (commits.incomplete_results) throw new Error("GitHub returned incomplete commit-search results");
  return {
    repos: requireCount(user.public_repos, "repository"),
    commits: requireCount(commits.total_count, "commit"),
  };
}

function updateProfile(stats) {
  const source = readFileSync(PROFILE_PATH, "utf8");
  if (!STATS_PATTERN.test(source)) throw new Error("Could not find the generated stats field in profile.mjs");
  const next = source.replace(STATS_PATTERN, `stats: { repos: ${stats.repos}, commits: ${stats.commits} }`);
  if (next !== source) writeFileSync(PROFILE_PATH, next);
  return next !== source;
}

const stats = await fetchPublicStats();
const changed = updateProfile(stats);
console.log(`${changed ? "updated" : "verified"} public GitHub stats: ${stats.repos} repos, ${stats.commits} commits`);
