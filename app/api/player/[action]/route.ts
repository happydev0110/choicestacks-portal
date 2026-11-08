import { authBackendUrl, sessionCookies } from '../../../lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ action: string }> };

async function forward(request: Request, context: Context) {
  const { action } = await context.params;
  const method = action === 'me' ? 'GET' : ['register', 'login', 'logout'].includes(action) ? 'POST' : null;
  const fail = (status: number, message: string) => Response.json({ success: false, error: { message } }, {
    status, headers: { 'Cache-Control': 'no-store' },
  });
  if (!method) return fail(404, 'This endpoint does not exist.');
  if (request.method !== method) return fail(405, 'This method is not allowed.');
  try {
    let body: string | undefined;
    if (method === 'POST') {
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return fail(415, 'Send a JSON request.');
      const reader = request.body?.getReader();
      const chunks: Uint8Array[] = [];
      let length = 0;
      if (reader) {
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          length += part.value.byteLength;
          if (length > 8192) { await reader.cancel(); return fail(413, 'The request is too large.'); }
          chunks.push(part.value);
        }
      }
      body = Buffer.concat(chunks).toString('utf8');
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const cookie = sessionCookies(request.headers.get('cookie') ?? '');
    if (cookie) headers.set('Cookie', cookie);
    // Preserve the browser's CSRF signals. Never manufacture an approved Origin/header.
    for (const name of ['origin', 'x-requested-with']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const upstream = await fetch(authBackendUrl(action), {
      method, headers, ...(body === undefined ? {} : { body }),
      cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(12000),
    });
    const outgoing = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    for (const cookieValue of upstream.headers.getSetCookie()) outgoing.append('Set-Cookie', cookieValue);
    for (const name of ['retry-after', 'x-request-id']) {
      const value = upstream.headers.get(name);
      if (value) outgoing.set(name, value);
    }
    return new Response(await upstream.text(), { status: upstream.status, headers: outgoing });
  } catch { return fail(503, 'Player sign-in is unavailable. Please try again later.'); }
}

export const GET = forward;
export const POST = forward;
