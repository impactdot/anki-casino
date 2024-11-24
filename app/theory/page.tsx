"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Theory() {
    const [theory, setTheory] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get("topic");

    useEffect(() => {
        // In a real application, you would fetch the theory from an API
        // For this example, we'll use a placeholder
        setTheory(
            `This is a brief theory about ${topic}. In a real application, this would be fetched from an API or generated using AI.`
        );
    }, [topic]);

    const handleContinue = () => {
        router.push(`/flashcards?topic=${encodeURIComponent(topic || "")}`);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8">Theory: {topic}</h1>
            <div className="w-full max-w-md mb-8">
                <p className="text-lg mb-4">{theory}</p>
            </div>
            <button
                onClick={handleContinue}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Continue to Flashcards
            </button>
        </main>
    );
}
