"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FlashCard } from "../components/flashcards/FlashCard";
import { FlashCardControls } from "../components/flashcards/FlashCardControls";

interface Flashcard {
    question: string;
    answer: string;
}

export default function Flashcards() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const searchParams = useSearchParams();
    const topic = searchParams.get("topic");

    useEffect(() => {
        // In a real application, you would fetch flashcards from an API
        // For this example, we'll use placeholder data
        setFlashcards([
            {
                question: `What is ${topic}?`,
                answer: `This is the answer about ${topic}.`,
            },
            {
                question: `Key concept of ${topic}?`,
                answer: `This is a key concept of ${topic}.`,
            },
            {
                question: `Application of ${topic}?`,
                answer: `This is an application of ${topic}.`,
            },
        ]);
    }, [topic]);

    const handleNextCard = () => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
        setShowAnswer(false);
    };

    const handlePrevCard = () => {
        setCurrentCard(
            (prev) => (prev - 1 + flashcards.length) % flashcards.length
        );
        setShowAnswer(false);
    };

    const toggleAnswer = () => {
        setShowAnswer((prev) => !prev);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8">Flashcards: {topic}</h1>
            {flashcards.length > 0 && (
                <div className="w-full max-w-md mb-8">
                    <FlashCard
                        question={flashcards[currentCard].question}
                        answer={flashcards[currentCard].answer}
                        showAnswer={showAnswer}
                        onFlip={toggleAnswer}
                    />
                    <FlashCardControls
                        onPrevious={handlePrevCard}
                        onNext={handleNextCard}
                        onFlip={toggleAnswer}
                        showAnswer={showAnswer}
                    />
                </div>
            )}
        </main>
    );
}
