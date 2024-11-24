"use client";

import { useState, useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Address } from "@ton/core";

export default function Profile() {
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!tonConnectUI.connected) {
      router.push("/");
      return;
    }

    if (tonConnectUI.account?.address) {
      setWalletAddress(tonConnectUI.account.address);
    }
  }, [tonConnectUI.connected, tonConnectUI.account, router]);

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return tempAddress;
  };

  const handleDisconnect = async () => {
    await tonConnectUI.disconnect();
    router.push("/");
  };

  if (!walletAddress) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 border border-[var(--input-border)] rounded-lg bg-[var(--input-background)]">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium opacity-70">
              Wallet Address
            </label>
            <p className="text-lg font-medium">
              {formatAddress(walletAddress)}
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleDisconnect}
              variant="danger"
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
