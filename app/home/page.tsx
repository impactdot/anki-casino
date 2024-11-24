"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stakes } from "../components/Stakes";
import { WalletHeader } from "../components/WalletHeader";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState("5");
  const [tonAmount, setTonAmount] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && tonAmount) {
      // For now, just log the stake amount
      console.log(`Stake submitted: ${tonAmount} TON`);
      // In the future, this would trigger a smart contract interaction

      router.push(
        `/theory?topic=${encodeURIComponent(topic)}&numCards=${numCards}`
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <WalletHeader />
      <h1 className="text-3xl font-bold mb-8">Flashcard Generator</h1>
      <Stakes
        topic={topic}
        numCards={numCards}
        tonAmount={tonAmount}
        onTopicChange={(e) => setTopic(e.target.value)}
        onNumCardsChange={(e) => setNumCards(e.target.value)}
        onTonAmountChange={(e) => setTonAmount(e.target.value)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
