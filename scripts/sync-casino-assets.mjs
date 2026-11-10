import { readFile, writeFile, access } from "node:fs/promises";
import { basename, join } from "node:path";

// Public artwork URLs observed on the reference casino page. No runtime requests
// to the reference site are needed after these files have been saved locally.
const reference = JSON.parse(
  await readFile(
    new URL("./casino-reference-assets.json", import.meta.url),
    "utf8",
  ),
);
const sources = [
  reference.banner,
  ...reference.categories.map((c) => c.src),
  ...(reference.rowIcons ?? []),
  ...reference.rows.flatMap((r) => r.items.map((g) => g.src)),
];
const queue = [...new Set(sources)];
const sourceOrigin = process.env.ASSET_SOURCE_ORIGIN
  ? new URL(process.env.ASSET_SOURCE_ORIGIN)
  : null;
if (sourceOrigin && (
  sourceOrigin.protocol !== "https:" || sourceOrigin.username ||
  sourceOrigin.password || sourceOrigin.pathname !== "/" ||
  sourceOrigin.search || sourceOrigin.hash
)) throw new Error("ASSET_SOURCE_ORIGIN must be an HTTPS origin without a path or credentials.");
const allowedOrigins = new Set([
  "https://d3nybwyntoyv6z.cloudfront.net",
  ...(sourceOrigin ? [sourceOrigin.origin] : []),
]);
let downloaded = 0;
let existing = 0;
async function worker() {
  while (queue.length) {
    const source = queue.shift();
    const url = new URL(source, sourceOrigin ?? "https://assets.invalid");
    const file = join("public", "assets", basename(url.pathname));
    try {
      await access(file);
      existing++;
      continue;
    } catch {}
    if (url.origin === "https://assets.invalid")
      throw new Error(`Missing local asset ${file}. Set ASSET_SOURCE_ORIGIN to restore it.`);
    if (!allowedOrigins.has(url.origin) || url.username || url.password)
      throw new Error("Unexpected asset origin");
    const response = await fetch(url, {
      signal: AbortSignal.timeout(30000),
      redirect: "error",
    });
    if (!response.ok)
      throw new Error(`Asset request failed: ${url} (${response.status})`);
    await writeFile(file, new Uint8Array(await response.arrayBuffer()));
    downloaded++;
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
console.log(
  `Casino artwork: ${downloaded} downloaded, ${existing} existing files reused.`,
);
