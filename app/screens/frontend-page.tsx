"use client";
import { type PageDefinition } from "../site-map";
import { CatalogScreen, GameScreen, ProvidersScreen } from "./catalog-screen";
import { SportsScreen } from "./sports-screen";
import {
  AffiliateScreen,
  CryptoScreen,
  LoyaltyScreen,
  PromotionScreen,
  PromotionsScreen,
  ReferralScreen,
} from "./marketing-screen";
import { ContactScreen, FaqScreen, PolicyScreen } from "./support-screen";
import { AuthScreen } from "./auth-screen";
import { CasinoScreen } from "./casino-screen";
import { ConnectedCasino } from './provider-games';
export function FrontendPage({
  definition,
  pageKey,
}: {
  definition: PageDefinition;
  pageKey: string;
}) {
  switch (definition.kind) {
    case "casino":
      return <ConnectedCasino><CasinoScreen /></ConnectedCasino>;
    case "catalog":
      return <CatalogScreen definition={definition} pageKey={pageKey} />;
    case "providers":
      return <ConnectedCasino><ProvidersScreen /></ConnectedCasino>;
    case "game":
      return <GameScreen definition={definition} />;
    case "sports":
      return <SportsScreen />;
    case "promotions":
      return <PromotionsScreen />;
    case "promotion":
      return <PromotionScreen pageKey={pageKey} />;
    case "loyalty":
      return <LoyaltyScreen />;
    case "affiliate":
      return <AffiliateScreen />;
    case "referral":
      return <ReferralScreen />;
    case "crypto":
      return <CryptoScreen />;
    case "contact":
      return <ContactScreen complaint={pageKey === "complaints"} />;
    case "faq":
      return <FaqScreen />;
    case "policy":
      return <PolicyScreen pageKey={pageKey} title={definition.title} />;
    case "auth":
      return <AuthScreen pageKey={pageKey} />;
    case "account":
      return null; // Account routes are authenticated on the server in app/account/.
  }
}
