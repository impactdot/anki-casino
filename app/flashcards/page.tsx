"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FlashCard } from "../components/flashcards/FlashCard";
import { FlashCardControls } from "../components/flashcards/FlashCardControls";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsData {
  theory: string;
  flashcards: Flashcard[];
}

interface UserAnswer {
  questionNumber: number;
  answer: string;
}

interface EvaluationResult {
  correctness: string;
  feedback: string;
  score: string;
}

const STORAGE_KEY = "flashcards_data";

export default function Flashcards() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get("topic");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (storedData) {
      try {
        const data: FlashcardsData = JSON.parse(storedData);
        setFlashcards(data.flashcards);
        setUserAnswers(new Array(data.flashcards.length).fill(""));
      } catch (error) {
        console.error("Failed to parse stored flashcards data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleNextCard = () => {
    if (currentCard === flashcards.length - 1) {
      submitAllAnswers();
    } else {
      setCurrentCard((prev) => prev + 1);
      setShowAnswer(false);
      setIsSubmitted(false);
    }
  };

  const handlePrevCard = () => {
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
    setShowAnswer(false);
    setIsSubmitted(false);
  };

  const toggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentCard] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmitAnswer = () => {
    if (!isSubmitted) {
      setIsSubmitted(true);
      setShowAnswer(true);
    }
  };

  const submitAllAnswers = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    const formattedAnswers = userAnswers.reduce((acc, answer, index) => {
      acc[index + 1] = answer;
      return acc;
    }, {} as { [key: string]: string });

    try {
      const response = await fetch(
        "https://lemming-quiet-fairly.ngrok-free.app/evaluate_answers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: formattedAnswers,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Evaluation result:", result);

      // Store the evaluation results
      localStorage.setItem("evaluation_results", JSON.stringify(result));
      localStorage.removeItem(STORAGE_KEY);

      router.push("/results");
    } catch (error) {
      console.error("Failed to submit answers:", error);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (flashcards.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {isSubmitting ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            Submitting your answers...
          </h2>
          <div className="animate-pulse">Please wait...</div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Flashcards: {topic}</h1>
          <div className="w-full max-w-md mb-8">
            <div className="mb-4 text-center">
              Card {currentCard + 1} of {flashcards.length}
            </div>
            <FlashCard
              question={flashcards[currentCard].front}
              answer={flashcards[currentCard].back}
              showAnswer={showAnswer}
              userAnswer={userAnswers[currentCard]}
              onAnswerChange={handleAnswerChange}
              onFlip={toggleAnswer}
              isSubmitted={isSubmitted}
            />
            <FlashCardControls
              onPrevious={handlePrevCard}
              onNext={handleNextCard}
              onSubmit={handleSubmitAnswer}
              onFlip={toggleAnswer}
              showAnswer={showAnswer}
              isSubmitted={isSubmitted}
              isLastCard={currentCard === flashcards.length - 1}
            />
          </div>
        </>
      )}
    </main>
  );
}
