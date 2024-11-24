interface FlashCardProps {
    question: string;
    answer: string;
    showAnswer: boolean;
    onFlip: () => void;
}

export function FlashCard({
    question,
    answer,
    showAnswer,
    onFlip,
}: FlashCardProps) {
    return (
        <div
            onClick={onFlip}
            className="border border-[var(--input-border)] rounded p-4 mb-4 min-h-[200px] 
                flex items-center justify-center cursor-pointer
                bg-[var(--input-background)] text-[var(--input-foreground)]
                transition-colors duration-200"
        >
            <p className="text-lg text-center">
                {showAnswer ? answer : question}
            </p>
        </div>
    );
}
