"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/ui/Button";
import { TeX } from "../components/ui/TeX";

interface FlashcardsData {
  theory: string;
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

const STORAGE_KEY = "flashcards_data";

const processText = (text: string) => {
  // First, replace \( and \) with $ for inline math
  text = text.replace(/\\\(/g, "$").replace(/\\\)/g, "$");

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

export default function Theory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const [data, setData] = useState<FlashcardsData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      } catch (error) {
        console.error("Failed to parse flashcards data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleContinue = () => {
    router.push(`/flashcards?topic=${encodeURIComponent(topic || "")}`);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Theory: {topic}</h1>
      <div className="w-full max-w-2xl mb-8">
        <div className="prose dark:prose-invert max-w-none">
          {data && processText(data.theory)}
        </div>
      </div>
      <Button onClick={handleContinue} variant="primary">
        Continue to Flashcards
      </Button>
    </main>
  );
}
