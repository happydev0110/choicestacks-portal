import { readFile } from "node:fs/promises";

// Build first so the check follows the generated route registry, including games/providers.
const origin = process.argv[2] || "http://198.18.1.255:3000";
const manifest = JSON.parse(
  await readFile(
    new URL("../.next/prerender-manifest.json", import.meta.url),
    "utf8",
  ),
);
const routes = Object.keys(manifest.routes).filter(
  (route) => !route.startsWith("/_"),
);
const protectedRoutes = ['', '/profile', '/wallet', '/deposit', '/withdraw', '/transactions', '/bonuses', '/favorites', '/security', '/verification', '/responsible-gaming'].map((section) => '/account' + section);
protectedRoutes.push('/play/00000000-0000-4000-8000-000000000001');
const queue = [...routes, ...protectedRoutes];
const failures = [];
const linkedPaths = new Set();
let checked = 0;
async function worker() {
  while (queue.length) {
    const path = queue.shift();
    try {
      const response = await fetch(new URL(path, origin), {
        signal: AbortSignal.timeout(30000),
        redirect: 'manual',
      });
      if (protectedRoutes.includes(path)) {
        const destination = new URL(response.headers.get('location') || '/', origin);
        if (response.status !== 307 || destination.pathname !== '/login' || destination.searchParams.get('next') !== path)
          failures.push(`${path}: expected a redirect to sign in, received ${response.status}`);
        checked++;
        continue;
      }
      const html = await response.text();
      if (
        response.status !== 200 ||
        !html.includes("main-content") ||
        !/<h1[\s>]/.test(html)
      )
        failures.push(
          `${path}: HTTP ${response.status}, missing page heading or shell`,
        );
      for (const match of html.matchAll(/href="(\/(?!_next|assets)[^"?#]*)"/g))
        linkedPaths.add(match[1]);
    } catch (error) {
      failures.push(`${path}: ${error.message}`);
    }
    checked++;
    if (checked % 30 === 0)
      console.log(`Checked ${checked}/${routes.length + protectedRoutes.length} routes`);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
for (const path of linkedPaths)
  if (!routes.includes(path) && !protectedRoutes.includes(path))
    failures.push(`Internal link has no generated route: ${path}`);
for (const path of [
  "/this-page-does-not-exist",
  "/games/unknown-title",
  "/toString",
  "/account/unknown-section",
  "/play/not-a-game-id",
]) {
  const response = await fetch(new URL(path, origin));
  if (response.status !== 404)
    failures.push(`${path}: expected 404, received ${response.status}`);
}
console.log(
  `${routes.length} public pages, ${protectedRoutes.length} protected pages and ${linkedPaths.size} internal link destinations checked at ${origin}.`,
);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "PASS: Public pages render, account pages require login, internal links resolve, and unknown routes return 404.",
  );
