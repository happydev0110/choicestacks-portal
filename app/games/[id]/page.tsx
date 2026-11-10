import Link from "next/link";
import { notFound } from "next/navigation";
import type { ProviderGame } from "../../lib/gaming";
import { FavoriteButton, ProviderArtwork } from "../../screens/provider-cards";
import "../../screens/provider-games.css";

export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)
  )
    notFound();
  let response: Response;
  try {
    response = await fetch(
      `${(process.env.BACKEND_URL ?? "http://127.0.0.1:4000").replace(/\/$/, "")}/api/v1/gaming/games/${id}`,
      { cache: "no-store", signal: AbortSignal.timeout(5000) },
    );
  } catch {
    return (
      <div className="page-wrap panel">
        <h1>Game temporarily unavailable</h1>
        <Link href="/casino">Back to games</Link>
      </div>
    );
  }
  if (response.status === 404) notFound();
  if (!response.ok)
    return (
      <div className="page-wrap panel">
        <h1>Game temporarily unavailable</h1>
        <Link href="/casino">Back to games</Link>
      </div>
    );
  const { data } = (await response.json()) as {
    data: { game: ProviderGame; launchEnabled: boolean; currency: string };
  };
  const { game } = data;
  return (
    <div className="page-wrap">
      <Link className="back-link" href="/casino">
        ← All games
      </Link>
      <section className="panel provider-launch">
        <div className="provider-launch-art">
          <ProviderArtwork game={game} />
        </div>
        <div>
          <span className="eyebrow">CHOICESTAKES</span>
          <h1>{game.name}</h1>
          <p>
            Provider:{" "}
            <Link href={`/providers/${encodeURIComponent(game.provider)}`}>
              {game.provider}
            </Link>
          </p>
          <p>Vendor: {game.vendor}</p>
          <p>Sandbox collection · {data.currency} test credits</p>
          {!data.launchEnabled && (
            <p className="provider-availability">
              Sandbox play will be available once setup is complete.
            </p>
          )}
          <div className="provider-launch-actions">
            {data.launchEnabled && (
              <Link className="primary" href={`/play/${game.uuid}`}>
                Play with test credits
              </Link>
            )}
            <FavoriteButton game={game} />
          </div>
        </div>
      </section>
    </div>
  );
}
