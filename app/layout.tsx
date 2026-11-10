import type { Metadata } from "next";
import "./globals.css";
import "./screens/screens.css";
import { SiteShell } from "./components/site-shell";
import { PlayerAuthProvider } from "./components/player-auth";
import { GameWalletProvider } from "./components/game-wallet";
import { ToastProvider } from "./components/toast-provider";
export const metadata: Metadata = {
  title: "choicestakes",
  description:
    "Choicestakes casino and sportsbook. Explore games from our connected providers.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ToastProvider><PlayerAuthProvider><GameWalletProvider><SiteShell>{children}</SiteShell></GameWalletProvider></PlayerAuthProvider></ToastProvider>
      </body>
    </html>
  );
}
