"use client";

import { useState, useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Address } from "@ton/core";

export function WalletHeader() {
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  const [depositAmount, setDepositAmount] = useState<string | null>(null);

  useEffect(() => {
    if (tonConnectUI?.connected) {
      checkDeposit();
    }
  }, [tonConnectUI?.connected]);

  const checkDeposit = async () => {
    try {
      const response = await fetch(
        "https://lemming-quiet-fairly.ngrok-free.app/get_balance",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            wallet_id: tonConnectUI?.account?.address || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDepositAmount(data.external_balance);
      }
    } catch (error) {
      console.error("Failed to check deposit:", error);
    }
  };

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
  };

  const handleDepositClick = () => {
    router.push("/deposit");
  };

  if (!tonConnectUI?.connected) return null;

  return (
    <div className="fixed top-0 right-0 p-4 flex items-center gap-4">
      <Button
        variant={depositAmount ? "secondary" : "primary"}
        onClick={handleDepositClick}
        className="text-sm"
      >
        {depositAmount ? `${depositAmount} TON` : "Deposit"}
      </Button>
      <Button
        variant="secondary"
        onClick={() => router.push("/profile")}
        className="text-sm"
      >
        {formatAddress(tonConnectUI?.account?.address || "")}
      </Button>
    </div>
  );
}
