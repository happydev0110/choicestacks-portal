"use client";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Gamepad2, Heart, Play } from "lucide-react";
import type { ProviderGame } from "../lib/gaming";

const storageKey = "choicestakes-provider-favorites-v1";
const changed = "choicestakes-favorites-changed";
const uuidPattern =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function snapshot() {
  try {
    return localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return "[]";
  }
}
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(changed, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(changed, listener);
  };
}
function parseFavorites(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? [
          ...new Set(
            value
              .filter(
                (id): id is string =>
                  typeof id === "string" && uuidPattern.test(id),
              )
              .map((id) => id.toLowerCase()),
          ),
        ].slice(0, 100)
      : [];
  } catch {
    return [];
  }
}
export function useProviderFavorites() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const ids = useMemo(() => parseFavorites(raw), [raw]);
  const [error, setError] = useState("");
  function toggle(id: string) {
    const current = parseFavorites(snapshot());
    if (!current.includes(id) && current.length >= 100) {
      setError("You can save up to 100 favorites on this device.");
      return;
    }
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(
          current.includes(id)
            ? current.filter((value) => value !== id)
            : [...current, id],
        ),
      );
      window.dispatchEvent(new Event(changed));
      setError("");
    } catch {
      setError(
        "Your browser could not save this favorite. Check its storage settings.",
      );
    }
  }
  return { ids, toggle, error };
}
export function FavoriteButton({
  game,
  compact = false,
}: {
  game: ProviderGame;
  compact?: boolean;
}) {
  const { ids, toggle, error } = useProviderFavorites();
  const saved = ids.includes(game.uuid);
  return (
    <div className={compact ? "provider-favorite" : "provider-favorite-detail"}>
      <button
        className="secondary"
        aria-pressed={saved}
        aria-label={`${saved ? "Remove" : "Add"} ${game.name} ${saved ? "from" : "to"} favorites`}
        onClick={() => toggle(game.uuid)}
      >
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
        {!compact && (saved ? "Saved to favorites" : "Add to favorites")}
      </button>
      {error && (
        <p role="alert" className="auth-error">
          {error}
        </p>
      )}
    </div>
  );
}
export function ProviderArtwork({ game }: { game: ProviderGame }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [game.imageUrl]);
  return game.imageUrl && !failed ? (
    <img
      src={game.imageUrl}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  ) : (
    <Gamepad2 size={46} aria-label="Game artwork unavailable" />
  );
}
export function ProviderGameCard({ game }: { game: ProviderGame }) {
  return (
    <article className="provider-game-card">
      <Link className="catalog-card" href={`/play/${game.uuid}`} prefetch={false}>
        <div className="catalog-art provider-art">
          <ProviderArtwork game={game} />
          <span className="catalog-play">
            <Play size={28} />
          </span>
        </div>
        <strong>{game.name}</strong>
        <small>{game.provider}</small>
      </Link>
      <FavoriteButton game={game} compact />
    </article>
  );
}
export function ProviderGameGrid({ games }: { games: ProviderGame[] }) {
  return (
    <div className="catalog-grid">
      {games.map((game) => (
        <ProviderGameCard key={game.uuid} game={game} />
      ))}
    </div>
  );
}
