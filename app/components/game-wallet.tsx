"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { gamingRequest, type SandboxWalletData } from "../lib/gaming";
import { usePlayer } from "./player-auth";

type WalletState = {
  owner: string | null;
  wallet: SandboxWalletData | null;
  loading: boolean;
  error: string;
};
const empty: WalletState = { owner: null, wallet: null, loading: false, error: "" };
const WalletContext = createContext({ ...empty, refresh: () => {} });
export const useGameWallet = () => useContext(WalletContext);

// One wallet request supplies the header, wallet screen, and recent game activity.
export function GameWalletProvider({ children }: { children: React.ReactNode }) {
  const { player, loading: sessionLoading } = usePlayer();
  const playerId = player?.id ?? null;
  const pathname = usePathname();
  const [state, setState] = useState<WalletState>(empty);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!playerId || sessionLoading) {
      setState(empty);
      return;
    }
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    setState((previous) => ({
      owner: playerId,
      wallet: previous.owner === playerId ? previous.wallet : null,
      loading: true,
      error: "",
    }));
    void gamingRequest<SandboxWalletData>("wallet", undefined, controller.signal)
      .then((wallet) => {
        if (active) setState({ owner: playerId, wallet, loading: false, error: "" });
      })
      .catch(() => {
        if (active) setState({
          owner: playerId, wallet: null, loading: false,
          error: "Game balance is temporarily unavailable. Please try again.",
        });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [playerId, sessionLoading, pathname, revision]);

  useEffect(() => {
    if (!playerId) return;
    const updateWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const interval = window.setInterval(updateWhenVisible, 30000);
    document.addEventListener("visibilitychange", updateWhenVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateWhenVisible);
    };
  }, [playerId, refresh]);

  // Never expose the preceding account's balance while an account switch settles.
  const current = state.owner === playerId && !sessionLoading
    ? state : { ...empty, loading: Boolean(playerId) || sessionLoading };
  return <WalletContext.Provider value={{ ...current, refresh }}>{children}</WalletContext.Provider>;
}
