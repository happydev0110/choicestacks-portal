"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Info, Play, Search } from "lucide-react";
import { asset, type Game } from "../data";
import { gameHref } from "../site-map";

export function PageHeading({
  title,
  description,
  eyebrow = "WIN777 LIVE",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <div className="page-heading">
      <Link href="/" className="back-link">
        <ArrowLeft size={14} /> Home
      </Link>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Notice({
  children,
  success = false,
}: {
  children: React.ReactNode;
  success?: boolean;
}) {
  return (
    <div
      role={success ? "status" : undefined}
      className={`page-notice ${success ? "is-success" : ""}`}
    >
      {success ? <CheckCircle2 size={19} /> : <Info size={19} />}
      <div>{children}</div>
    </div>
  );
}
export function EmptyState({
  title = "Nothing here yet",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-empty">
      <Search size={32} />
      <h3>{title}</h3>
      <p>{children}</p>
      <Link href="/casino" className="secondary">
        Explore games
      </Link>
    </div>
  );
}
export function GameGrid({ items }: { items: Game[] }) {
  return (
    <div className="catalog-grid">
      {items.map((game) => (
        <Link
          className="catalog-card"
          href={gameHref(game.name)}
          key={game.name}
        >
          <div className="catalog-art">
            <img src={asset(game.image)} alt="" loading="lazy" />
            <span className="catalog-play">
              <Play fill="currentColor" size={27} />
            </span>
          </div>
          <strong>{game.name}</strong>
          <small>{game.provider}</small>
        </Link>
      ))}
    </div>
  );
}
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("win777-favorites") ?? "[]",
      );
      if (Array.isArray(saved))
        setFavorites(saved.filter((x) => typeof x === "string"));
    } catch {}
  }, []);
  function toggle(name: string) {
    setFavorites((current) => {
      const next = current.includes(name)
        ? current.filter((x) => x !== name)
        : [...current, name];
      localStorage.setItem("win777-favorites", JSON.stringify(next));
      return next;
    });
  }
  return { favorites, toggle };
}
