import { Button } from "../ui/Button";

interface FlashCardControlsProps {
    onPrevious: () => void;
    onNext: () => void;
    onFlip: () => void;
    showAnswer: boolean;
}

export function FlashCardControls({
    onPrevious,
    onNext,
    onFlip,
    showAnswer,
}: FlashCardControlsProps) {
    return (
        <div className="flex justify-between">
            <Button variant="secondary" onClick={onPrevious}>
                Previous
            </Button>
            <Button variant="primary" onClick={onFlip}>
                {showAnswer ? "Show Question" : "Show Answer"}
            </Button>
            <Button variant="secondary" onClick={onNext}>
                Next
            </Button>
        </div>
    );
}
