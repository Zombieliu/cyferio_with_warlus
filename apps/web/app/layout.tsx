"use client";

import "@repo/ui/globals.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@mysten/dapp-kit/dist/index.css";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { NETWORK } from "./chain/config";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import {PrivyProvider} from '@privy-io/react-auth';


const inter = Inter({ subsets: ["latin"] });

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
          <PrivyProvider
          appId="cm0o2vtqd04lf9gashae43gzb"
          config={{
            // Customize Privy's appearance in your app
            appearance: {
              theme: 'light',
              accentColor: '#676FFF',
              logo: 'https://your-logo-url',
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
          }}
        >
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork={NETWORK}>
            <WalletProvider>
            <EnokiFlowProvider apiKey="enoki_public_7278cc47e76ec32331cf1f8fc83a4b1a">
              <Toaster />
              {children}
              <div className="bg-slate-100">
              </div>
              </EnokiFlowProvider>
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}