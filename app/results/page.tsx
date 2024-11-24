"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { TeX } from "../components/ui/TeX";
import { useTonConnectUI } from "@tonconnect/ui-react";

interface EvaluationResult {
  correctness: string;
  feedback: string;
  score: number;
}

interface FeedbackData {
  [key: string]: EvaluationResult;
}

const processText = (text: string | undefined) => {
  if (!text) return "";

  const parts = text.split(/((?:\$\$[\s\S]*?\$\$)|(?:\$[\s\S]*?\$))/);

  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return <TeX key={index} math={part.slice(2, -2)} block />;
    } else if (part.startsWith("$") && part.endsWith("$")) {
      return <TeX key={index} math={part.slice(1, -1)} />;
    }
    return part;
  });
};

export default function Results() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [reward, setReward] = useState<number>(0);

  useEffect(() => {
    const storedFeedback = localStorage.getItem("evaluation_results");
    const storedStake = localStorage.getItem("stake_amount");

    if (storedFeedback && storedStake) {
      try {
        const parsedFeedback: FeedbackData = JSON.parse(storedFeedback);
        const stakeAmount = Number(storedStake);

        // Validate stake amount
        if (isNaN(stakeAmount) || stakeAmount <= 0) {
          console.error("Invalid stake amount:", storedStake);
          setStakeAmount(0);
          setReward(0);
        } else {
          setStakeAmount(stakeAmount);

          // Calculate total score
          let total = 0;
          let max = 0;
          Object.values(parsedFeedback).forEach((item) => {
            const score = Number(item.score);
            if (!isNaN(score)) {
              // Add validation for score
              total += score;
              max += 10;
            }
          });

          setTotalScore(total);
          setMaxScore(max);

          // Calculate reward with validation
          const scorePercentage = max > 0 ? total / max : 0;
          const calculatedReward = stakeAmount * scorePercentage;
          setReward(isNaN(calculatedReward) ? 0 : calculatedReward);
        }

        setFeedback(parsedFeedback);
      } catch (error) {
        console.error("Failed to parse feedback data:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleReturnHome = () => {
    localStorage.removeItem("evaluation_results");
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            Loading your results...
          </h2>
          <div className="animate-pulse">Please wait...</div>
        </div>
      </main>
    );
  }

  if (!feedback) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No results found</h2>
          <Button onClick={handleReturnHome} variant="primary">
            Return to Home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Results</h1>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">
            Total Score: {totalScore}/{maxScore}
          </h2>
          <p className="text-lg mt-2">
            {maxScore > 0
              ? `(${((totalScore / maxScore) * 100).toFixed(1)}%)`
              : "(0%)"}
          </p>
          <div className="mt-4 p-4 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg">
            <p className="text-lg">
              Initial Stake: {stakeAmount.toFixed(2)} TON
            </p>
            <p className="text-lg font-bold mt-2">
              Reward: {reward.toFixed(2)} NEWTON
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(feedback).map(([questionNum, data]) => (
            <div
              key={questionNum}
              className={`bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-6 ${
                data.correctness === "correct"
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              <h3 className="font-bold mb-2">
                Question {questionNum} - Score: {data.score}
              </h3>
              <div className="prose dark:prose-invert">
                <div className="text-[var(--input-foreground)]">
                  {processText(data.feedback)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={handleReturnHome} variant="primary">
            Return to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
