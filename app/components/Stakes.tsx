"use client";

import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface StakesProps {
  topic: string;
  numCards: string;
  tonAmount: string;
  onTopicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNumCardsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTonAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface FlashcardsResponse {
  theory: string;
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

export function Stakes({
  topic,
  numCards,
  tonAmount,
  onTopicChange,
  onNumCardsChange,
  onTonAmountChange,
  onSubmit,
}: StakesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let response;

      if (inputMethod === "text") {
        response = await fetch("http://localhost:5002/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic,
            number: parseInt(numCards),
          }),
        });
      } else {
        const formData = new FormData();
        if (file) {
          formData.append("file", file);
          formData.append("number", numCards);

          response = await fetch("http://localhost:5002/flashcards", {
            method: "POST",
            body: formData,
          });
        } else {
          throw new Error("No file selected");
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FlashcardsResponse = await response.json();
      onSubmit(e);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate flashcards"
      );
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 border border-[var(--input-border)] rounded-lg bg-[var(--input-background)]">
      <h2 className="text-xl font-bold mb-4">Create Learning Challenge</h2>
      <p className="text-sm mb-6 text-[var(--input-foreground)] opacity-80">
        Set your learning topic and stake TON to commit to your learning
        journey. You&apos;ll get your stake back upon completing the flashcards.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Input Method</label>
        <select
          className="w-full p-2 rounded bg-[var(--input-background)] text-[var(--input-foreground)] border border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={inputMethod}
          onChange={(e) => setInputMethod(e.target.value as "text" | "file")}
        >
          <option value="text">Enter Topic</option>
          <option value="file">Upload PDF</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputMethod === "text" ? (
          <Input
            type="text"
            value={topic}
            onChange={onTopicChange}
            placeholder="Enter a topic (e.g., linear algebra, determinants)"
            label="Learning Topic"
          />
        ) : (
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            label="Upload PDF"
          />
        )}

        <Input
          type="number"
          value={numCards}
          onChange={onNumCardsChange}
          placeholder="Number of flashcards"
          min="1"
          max="20"
          label="Number of Questions"
        />
        <Input
          type="number"
          value={tonAmount}
          onChange={onTonAmountChange}
          placeholder="Enter TON amount"
          min="0.1"
          step="0.1"
          label="Learning Stake (TON)"
        />

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={
            (!topic.trim() && !file) ||
            !numCards ||
            !tonAmount ||
            !tonConnectUI?.connected ||
            isSubmitting
          }
        >
          {isSubmitting ? "Creating..." : "Start Learning Challenge"}
        </Button>

        {!tonConnectUI?.connected && (
          <p className="text-sm text-red-500 mt-2 text-center">
            Please connect your wallet first
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
