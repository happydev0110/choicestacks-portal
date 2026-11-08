import type { Metadata } from "next";
import "./globals.css";
import "./screens/screens.css";
import { SiteShell } from "./components/site-shell";
import { PlayerAuthProvider } from "./components/player-auth";
export const metadata: Metadata = {
  title: "Win777 | Casino & Sportsbook",
  description:
    "A responsive Next.js recreation of the Win777 casino lobby. Independent frontend demonstration.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <PlayerAuthProvider><SiteShell>{children}</SiteShell></PlayerAuthProvider>
      </body>
    </html>
  );
}
