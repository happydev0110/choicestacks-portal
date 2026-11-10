"use client";
import { useEffect, useRef, useState } from "react";
import { createGameRequestId, gamingRequest } from "./gaming";
import { useToast } from "../components/toast-provider";

type Mode = "real" | "demo";
type LaunchState =
  | { status: "idle" | "opening" }
  | { status: "playing"; link: string }
  | { status: "failed"; message: string; unauthorized: boolean };

export function useGameLaunch(gameId: string, playerId: string, enabled: boolean) {
  const toast = useToast();
  const [state, setState] = useState<LaunchState>({ status: "idle" });
  const [request, setRequest] = useState({ number: 0, mode: "real" as Mode });
  const attempt = useRef<{
    key: string;
    promise: Promise<{ link: string }>;
  } | null>(null);
  const canRetry = useRef(false);

  useEffect(() => {
    canRetry.current = false;
    if (!enabled) {
      setState({ status: "idle" });
      return;
    }
    let active = true;
    const key = `${playerId}:${gameId}:${request.number}`;
    // Keep the same promise across effect replays/refreshes. Aborting a POST
    // would not cancel the provider session and could cause a second launch.
    if (attempt.current?.key !== key) {
      attempt.current = {
        key,
        promise: gamingRequest<{ link: string }>(`games/${gameId}/launch`, {
          requestId: createGameRequestId(),
          mode: request.mode,
        }),
      };
    }
    setState({ status: "opening" });
    void attempt.current.promise.then(
      (result) => {
        if (active) setState({ status: "playing", link: result.link });
      },
      (reason: unknown) => {
        if (!active) return;
        const unauthorized =
          reason instanceof Error && "status" in reason && reason.status === 401;
        canRetry.current = !unauthorized;
        const message = reason instanceof Error
          ? reason.message : "Unable to open this game. Please try again.";
        toast.error(unauthorized ? "Please log in to continue playing." : message);
        setState({
          status: "failed",
          message,
          unauthorized,
        });
      },
    );
    // Ignore late responses when navigating away or changing accounts.
    return () => { active = false; canRetry.current = false; };
  }, [enabled, gameId, playerId, request, toast]);

  function retry(mode: Mode = request.mode) {
    if (!enabled || !canRetry.current) return;
    // Lock synchronously, before React renders, to also cover double clicks.
    canRetry.current = false;
    setState({ status: "opening" });
    setRequest((previous) => ({ number: previous.number + 1, mode }));
  }

  return { state, retry };
}
