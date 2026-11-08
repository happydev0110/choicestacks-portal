import { sessionCookies } from "../../../lib/auth-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function forward(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const route = path.join("/");
  const uuid = "[a-fA-F0-9-]{36}";
  const method =
    route === "games" ||
    route === "wallet" ||
    new RegExp(`^games/${uuid}$`).test(route)
      ? "GET"
      : new RegExp(`^games/${uuid}/launch$`).test(route)
        ? "POST"
        : null;
  const fail = (status: number, message: string) =>
    Response.json(
      { success: false, error: { message } },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  if (!method) return fail(404, "Game endpoint not found.");
  if (request.method !== method) return fail(405, "Method not allowed.");
  try {
    let body: string | undefined;
    if (method === "POST") {
      if (!request.headers.get("content-type")?.startsWith("application/json"))
        return fail(415, "Send a JSON request.");
      const reader = request.body?.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      if (reader)
        while (true) {
          const item = await reader.read();
          if (item.done) break;
          size += item.value.byteLength;
          if (size > 8192) {
            await reader.cancel();
            return fail(413, "Request too large.");
          }
          chunks.push(item.value);
        }
      body = Buffer.concat(chunks).toString("utf8");
    }
    const headers = new Headers({ "Content-Type": "application/json" });
    const cookie = sessionCookies(request.headers.get("cookie") ?? "");
    if (cookie) headers.set("Cookie", cookie);
    for (const name of ["origin", "x-requested-with"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const query = new URL(request.url).search;
    const base = (process.env.BACKEND_URL ?? "http://127.0.0.1:4000").replace(
      /\/$/,
      "",
    );
    const upstream = await fetch(`${base}/api/v1/gaming/${route}${query}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(12000),
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        ...(upstream.headers.get("retry-after")
          ? { "Retry-After": upstream.headers.get("retry-after")! }
          : {}),
      },
    });
  } catch {
    return fail(
      503,
      "The game service is temporarily unavailable. Please try again.",
    );
  }
}
export const GET = forward;
export const POST = forward;
