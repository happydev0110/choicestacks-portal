import { readFile } from "node:fs/promises";

// Build first; catalog games and providers are resolved at runtime, not prerendered.
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
const catalogResponse = await fetch(new URL('/api/gaming/games', origin));
if (!catalogResponse.ok) throw new Error(`Catalog request failed: ${catalogResponse.status}`);
const { data: catalog } = await catalogResponse.json();
const dynamicRoutes = catalog.games.slice(0, 3).map((game) => `/games/${game.uuid}`);
const expectedGameNames = new Map(catalog.games.slice(0, 3).map((game) => [`/games/${game.uuid}`, game.name]));
dynamicRoutes.push(...catalog.providers.map((provider) => `/providers/${encodeURIComponent(provider)}`));
routes.push(...dynamicRoutes);
const protectedRoutes = ['', '/profile', '/wallet', '/deposit', '/withdraw', '/transactions', '/bonuses', '/favorites', '/security', '/verification', '/responsible-gaming'].map((section) => '/account' + section);
protectedRoutes.push('/play/00000000-0000-4000-8000-000000000001');
protectedRoutes.push(...catalog.games.slice(0, 1).map((game) => `/play/${game.uuid}`));
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
      const expectedGameName = expectedGameNames.get(path);
      const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
      if (expectedGameName && !html.includes(`<h1>${escapeHtml(expectedGameName)}</h1>`))
        failures.push(`${path}: provider game details were not rendered`);
      if (path.startsWith('/providers/') && !html.includes('Explore the collection by game or provider.'))
        failures.push(`${path}: provider catalog was not rendered`);
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
  "/providers/not-a-real-provider",
]) {
  const response = await fetch(new URL(path, origin));
  if (response.status !== 404)
    failures.push(`${path}: expected 404, received ${response.status}`);
}
if (catalog.configured && catalog.total) {
  const seen = new Set();
  for (let page = 1; page <= Math.ceil(catalog.total / catalog.perPage); page++) {
    const response = await fetch(new URL(`/api/gaming/games?page=${page}`, origin));
    const { data } = await response.json();
    if (!response.ok || data.total !== catalog.total) throw new Error('Catalog changed or failed during pagination verification.');
    for (const game of data.games) {
      if (seen.has(game.uuid)) failures.push(`Duplicate catalog game: ${game.uuid}`);
      seen.add(game.uuid);
    }
  }
  if (seen.size !== catalog.total) failures.push(`Only ${seen.size}/${catalog.total} games are reachable by pagination.`);
  const first = catalog.games[0];
  for (const [query, expected] of [[`ids=${first.uuid}`, 1], ['ids=', 0], [`search=${encodeURIComponent('no-match-' + crypto.randomUUID())}`, 0]]) {
    const response = await fetch(new URL('/api/gaming/games?' + query, origin));
    if (!response.ok || (await response.json()).data.total !== expected) failures.push(`Catalog filter failed: ${query}`);
  }
  console.log(`All ${seen.size} provider games are reachable through the portal API.`);
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
