import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, polygonAmoy } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "AETHER Protocol",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "aether-protocol",
  chains: [polygonAmoy, polygon],
  ssr: true,
});

export const CHAINS = { polygonAmoy, polygon };
