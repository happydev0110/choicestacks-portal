import { notFound, redirect } from "next/navigation";
import { currentPlayer } from "../../lib/auth-server";
import type { ProviderGame } from "../../lib/gaming";
import { GamePlayerUnavailable, ProviderGamePlayer } from "../../screens/provider-games";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (
    !/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(
      id,
    )
  )
    notFound();
  let player;
  try {
    player = await currentPlayer();
  } catch {
    return (
      <GamePlayerUnavailable title="Account temporarily unavailable" message="Please try again shortly." />
    );
  }
  if (!player) redirect("/login?next=" + encodeURIComponent("/play/" + id));
  let response: Response;
  try {
    response = await fetch(
      `${(process.env.BACKEND_URL ?? "http://127.0.0.1:4000").replace(/\/$/, "")}/api/v1/gaming/games/${id}`,
      { cache: "no-store", signal: AbortSignal.timeout(5000) },
    );
  } catch {
    return (
      <GamePlayerUnavailable title="Game temporarily unavailable" message="Please return to the collection and try again later." />
    );
  }
  if (response.status === 404) notFound();
  if (!response.ok)
    return (
      <GamePlayerUnavailable title="Game temporarily unavailable" message="Please return to the collection and try again later." />
    );
  const { data } = (await response.json()) as {
    data: { game: ProviderGame; launchEnabled: boolean };
  };
  return (
    <ProviderGamePlayer
      key={`${player.id}:${data.game.uuid}`}
      game={data.game}
      playerId={player.id}
      launchEnabled={data.launchEnabled === true}
    />
  );
}
