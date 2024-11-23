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

    return (
        <div className="w-full max-w-md p-6 border border-[var(--input-border)] rounded-lg bg-[var(--input-background)]">
            <h2 className="text-xl font-bold mb-4">
                Create Learning Challenge
            </h2>
            <p className="text-sm mb-6 text-[var(--input-foreground)] opacity-80">
                Set your learning topic and stake TON to commit to your learning
                journey. You&apos;ll get your stake back upon completing the
                flashcards.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    type="text"
                    value={topic}
                    onChange={onTopicChange}
                    placeholder="Enter a topic (e.g., linear algebra, determinants)"
                    label="Learning Topic"
                />
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
                        !topic.trim() ||
                        !numCards ||
                        !tonAmount ||
                        !tonConnectUI.connected
                    }
                >
                    {isSubmitting ? "Creating..." : "Start Learning Challenge"}
                </Button>

                {!tonConnectUI.connected && (
                    <p className="text-sm text-red-500 mt-2 text-center">
                        Please connect your wallet first
                    </p>
                )}
            </form>
        </div>
    );
}
