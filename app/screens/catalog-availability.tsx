"use client";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { Gamepad2 } from "lucide-react";
import type { ProviderCatalogData } from "../lib/gaming";

export function collectionIsEmpty(data: ProviderCatalogData) {
  return (
    (data.catalog?.total ?? (data.providers.length ? 1 : data.total)) === 0
  );
}

// Recheck our own database API while the first import runs; never trigger provider imports from a visitor request.
export function usePendingCatalogRefresh(
  data: ProviderCatalogData | null,
  error: string,
  retry: Dispatch<SetStateAction<number>>,
) {
  const attempts = useRef(0);
  useEffect(() => {
    const pending =
      data?.catalog && ["not_synced", "syncing"].includes(data.catalog.status);
    if (!pending) {
      attempts.current = 0;
      return;
    }
    if (error || !data || !collectionIsEmpty(data) || attempts.current >= 15)
      return;
    const timer = setTimeout(() => {
      attempts.current++;
      retry((value) => value + 1);
    }, 8000);
    return () => clearTimeout(timer);
  }, [data, error, retry]);
}

export function CatalogAvailability({
  data,
  onRetry,
}: {
  data: ProviderCatalogData;
  onRetry: () => void;
}) {
  const status = data.catalog?.status;
  const importing = status === "syncing";
  return (
    <div className="panel provider-empty" role="status">
      <Gamepad2 size={42} />
      <h2>
        {importing
          ? "Loading the game collection"
          : status === "empty"
            ? "No games available right now"
            : "Games temporarily unavailable"}
      </h2>
      <p>
        {importing
          ? "The collection is updating. Games will appear here automatically when it is ready."
          : status === "empty"
            ? "There are currently no games available in this collection. Please check back later."
            : "We couldn’t load the collection yet. Please try again shortly."}
      </p>
      <button className="secondary" onClick={onRetry}>
        Refresh collection
      </button>
    </div>
  );
}
