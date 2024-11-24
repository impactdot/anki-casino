"use client";

import { useState, useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Deposit() {
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  const [depositAmount, setDepositAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    if (!tonConnectUI?.connected) {
      router.push("/");
      return;
    }

    // Check if user already has deposit
    checkDeposit();
  }, [tonConnectUI?.connected, router]);

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
        if (data.hasDeposit) {
          router.push("/home");
          return;
        }
      }
    } catch (error) {
      console.error("Failed to check deposit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      const response = await fetch(
        "https://lemming-quiet-fairly.ngrok-free.app/update_balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_id: tonConnectUI?.account?.address,
            amount: depositAmount,
          }),
        }
      );

      if (response.ok) {
        router.push("/home");
      } else {
        throw new Error("Failed to process deposit");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Failed to process deposit. Please try again.");
    } finally {
      setIsDepositing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 border border-[var(--input-border)] rounded-lg bg-[var(--input-background)]">
        <h1 className="text-2xl font-bold mb-6">Deposit TON</h1>
        <p className="text-sm mb-6 opacity-80">
          Deposit TON to start learning. Your deposit will be returned upon
          completing the challenges successfully.
        </p>

        <div className="space-y-4">
          <Input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount in TON"
            min="0.1"
            step="0.1"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <Button
            onClick={handleDeposit}
            className="w-full"
            disabled={!depositAmount || isDepositing}
          >
            {isDepositing ? "Processing..." : "Deposit TON"}
          </Button>
        </div>
      </div>
    </main>
  );
}
