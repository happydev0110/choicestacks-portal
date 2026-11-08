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
let downloaded = 0;
let existing = 0;
async function worker() {
  while (queue.length) {
    const source = queue.shift();
    const url = new URL(source, "https://win777live.com");
    if (
      !["win777live.com", "d3nybwyntoyv6z.cloudfront.net"].includes(
        url.hostname,
      )
    )
      throw new Error("Unexpected asset origin");
    const file = join("public", "assets", basename(url.pathname));
    try {
      await access(file);
      existing++;
      continue;
    } catch {}
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
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
