import { notFound } from "next/navigation";
import Link from "next/link";
import { ProviderCatalog } from "../../screens/provider-catalog";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  if (!provider || provider.length > 128) notFound();
  let response: Response;
  try {
    response = await fetch(
      `${(process.env.BACKEND_URL ?? "http://127.0.0.1:4000").replace(/\/$/, "")}/api/v1/gaming/games?${new URLSearchParams({ provider })}`,
      { cache: "no-store", signal: AbortSignal.timeout(5000) },
    );
  } catch {
    return (
      <div className="page-wrap panel">
        <h1>Provider temporarily unavailable</h1>
        <Link href="/providers">All providers</Link>
      </div>
    );
  }
  if (!response.ok)
    return (
      <div className="page-wrap panel">
        <h1>Provider temporarily unavailable</h1>
        <Link href="/providers">All providers</Link>
      </div>
    );
  const { data } = await response.json();
  if (!data.providers.includes(provider)) notFound();
  return (
    <ProviderCatalog
      key={provider}
      title={provider}
      initialProvider={provider}
    />
  );
}
