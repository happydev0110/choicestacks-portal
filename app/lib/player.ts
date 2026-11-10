export type Player = { id: string; email: string; displayName: string; emailVerified: boolean };

export function playerDestination(requested: string | null) {
  return requested && /^(?:\/account(?:\/[a-z-]+)?|\/play\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}|\/provider-games)$/.test(requested)
    ? requested : '/account';
}

export async function playerRequest<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/player/${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-Requested-With': 'choicestakes' },
      credentials: 'same-origin', cache: 'no-store',
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
    });
  } catch { throw new Error('Unable to connect. Please check your connection and try again.'); }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error?.message ?? 'Player sign-in is unavailable. Please try again later.');
    Object.assign(error, { status: response.status });
    throw error;
  }
  return payload.data as T;
}
