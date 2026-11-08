import 'server-only';
import { cookies } from 'next/headers';
import type { Player } from './player';

export function authBackendUrl(path: string) {
  return `${(process.env.BACKEND_URL ?? 'http://127.0.0.1:4000').replace(/\/$/, '')}/api/v1/auth/${path}`;
}

export function sessionCookies(raw: string) {
  return raw.split(';').map((part) => part.trim()).filter((part) =>
    /^(?:__Host-)?choicestakes_session=[A-Za-z0-9_-]{43}$/.test(part),
  ).join('; ');
}

export async function currentPlayer(): Promise<Player | null> {
  const cookie = sessionCookies((await cookies()).toString());
  if (!cookie) return null;
  const response = await fetch(authBackendUrl('me'), {
    headers: { Cookie: cookie }, cache: 'no-store', signal: AbortSignal.timeout(5000),
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Player service is unavailable.');
  return (await response.json()).data.player;
}
