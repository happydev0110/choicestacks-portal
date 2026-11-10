import type { ProviderLobbyData } from "../lib/gaming";
import { CasinoLobby } from "../screens/casino-lobby";

export const dynamic = "force-dynamic";

export default async function Page() {
  let data: ProviderLobbyData | null = null;
  let error = "";
  try {
    const base = (process.env.BACKEND_URL ?? "http://127.0.0.1:4000").replace(
      /\/$/,
      "",
    );
    const response = await fetch(`${base}/api/v1/gaming/lobby`, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Lobby unavailable");
    const result = await response.json();
    if (!result.success || !Array.isArray(result.data?.sections))
      throw new Error("Invalid lobby");
    data = result.data;
  } catch {
    error = "The game collection is temporarily unavailable. Please try again.";
  }
  return <CasinoLobby initialData={data} initialError={error} />;
}
