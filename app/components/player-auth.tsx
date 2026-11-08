'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { playerRequest, type Player } from '../lib/player';

const Context = createContext<{
  player: Player | null; loading: boolean;
  signedIn: (player: Player) => void; logout: () => Promise<void>; refresh: () => Promise<void>;
}>({ player: null, loading: true, signedIn: () => {}, logout: async () => {}, refresh: async () => {} });
export const usePlayer = () => useContext(Context);

export function PlayerAuthProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const generation = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const refresh = useCallback(async () => {
    const current = ++generation.current;
    try {
      const result = await playerRequest<{ player: Player }>('me');
      if (current === generation.current) setPlayer(result.player);
    } catch (error) {
      if (current === generation.current && error instanceof Error && 'status' in error && error.status === 401) setPlayer(null);
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const visible = () => { if (document.visibilityState === 'visible') void refresh(); };
    document.addEventListener('visibilitychange', visible);
    if ('BroadcastChannel' in window) {
      channel.current = new BroadcastChannel('choicestakes-auth');
      channel.current.onmessage = () => void refresh();
    }
    return () => { generation.current++; document.removeEventListener('visibilitychange', visible); channel.current?.close(); };
  }, [refresh]);
  const signedIn = (value: Player) => {
    generation.current++;
    setPlayer(value); setLoading(false);
    channel.current?.postMessage('changed');
  };
  const logout = async () => {
    await playerRequest('logout', {});
    generation.current++;
    setPlayer(null); setLoading(false);
    channel.current?.postMessage('changed');
  };
  return <Context.Provider value={{ player, loading, signedIn, logout, refresh }}>{children}</Context.Provider>;
}
