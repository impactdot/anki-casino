import { Button } from "../ui/Button";

interface FlashCardControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onFlip: () => void;
  showAnswer: boolean;
  isSubmitted: boolean;
  isLastCard: boolean;
}

export function FlashCardControls({
  onPrevious,
  onNext,
  onSubmit,
  onFlip,
  showAnswer,
  isSubmitted,
  isLastCard,
}: FlashCardControlsProps) {
  return (
    <div className="flex justify-between mt-4 gap-4">
      <Button variant="secondary" onClick={onPrevious}>
        Previous
      </Button>

      {!isSubmitted ? (
        <Button onClick={onSubmit} variant="primary">
          Submit Answer
        </Button>
      ) : !showAnswer ? (
        <Button onClick={onFlip} variant="primary">
          Show Answer
        </Button>
      ) : (
        <Button onClick={onNext} variant={isLastCard ? "primary" : "secondary"}>
          {isLastCard ? "Finish" : "Next"}
        </Button>
      )}
    </div>
  );
}
