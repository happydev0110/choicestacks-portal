export type ProviderGame = {
  uuid: string;
  code: string;
  name: string;
  provider: string;
  vendor: string;
  imageUrl: string | null;
};
export type ProviderCatalogData = {
  games: ProviderGame[];
  providers: string[];
  providerCounts: { provider: string; total: number }[];
  total: number;
  page: number;
  perPage: number;
  configured: boolean;
  launchEnabled: boolean;
  currency: string;
  environment: "sandbox";
  syncedAt: string | null;
  catalog?: {
    status:
      | "not_configured"
      | "not_synced"
      | "syncing"
      | "ready"
      | "empty"
      | "failed"
      | "stale";
    total: number;
    lastAttemptAt: string | null;
    lastSuccessAt: string | null;
  };
};
export type ProviderLobbyData = ProviderCatalogData & {
  sections: { category: string; total: number; games: ProviderGame[] }[];
};
export type SandboxWalletData = {
  currency: string;
  balance: string;
  initialized: boolean;
  initialCredits: string;
  environment: "sandbox";
  transactions: {
    action: string;
    amount: string;
    reversed: boolean;
    errorCode: string | null;
    createdAt: string;
  }[];
};

export function createGameRequestId() {
  // getRandomValues also works on HTTP LAN development origins, where randomUUID is unavailable.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function gamingRequest<T>(
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/gaming/" + path, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers:
        body === undefined
          ? {}
          : {
              "Content-Type": "application/json",
              "X-Requested-With": "choicestakes",
            },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: signal ?? AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error(
      "The game service is temporarily unavailable. Please try again.",
    );
  }
  const result = await response.json();
  if (!response.ok)
    throw Object.assign(
      new Error(result.error?.message ?? "Unable to load provider games."),
      { status: response.status, code: result.error?.code },
    );
  return result.data;
}
