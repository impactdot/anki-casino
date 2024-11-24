import { TeX } from "../ui/TeX";

interface FlashCardProps {
  question: string;
  answer: string;
  showAnswer: boolean;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onFlip: () => void;
  isSubmitted: boolean;
}

const processText = (text: string) => {
  // First, replace \( and \) with $ for inline math
  text = text.replace(/\\\(/g, "$").replace(/\\\)/g, "$");

  // Regular expression to match LaTeX expressions between $$ or $
  const parts = text.split(/((?:\$\$[\s\S]*?\$\$)|(?:\$[\s\S]*?\$))/);

  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      // Block math
      return <TeX key={index} math={part.slice(2, -2)} block />;
    } else if (part.startsWith("$") && part.endsWith("$")) {
      // Inline math
      return <TeX key={index} math={part.slice(1, -1)} />;
    }
    return part;
  });
};

export function FlashCard({
  question,
  answer,
  showAnswer,
  userAnswer,
  onAnswerChange,
  onFlip,
  isSubmitted,
}: FlashCardProps) {
  return (
    <div className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg shadow-md p-6 text-[var(--input-foreground)]">
      <div className="mb-4">
        <h3 className="font-bold mb-2">Question:</h3>
        <div className="prose dark:prose-invert max-w-none">
          {processText(question)}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="mb-4">
          <textarea
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full p-2 bg-[var(--input-background)] text-[var(--input-foreground)] border border-[var(--input-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Type your answer here..."
            rows={3}
          />
        </div>
      ) : (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Your Answer:</h3>
          <p className="mb-4">{userAnswer}</p>
          {showAnswer && (
            <>
              <h3 className="font-bold mb-2">Correct Answer:</h3>
              <div className="prose dark:prose-invert max-w-none">
                {processText(answer)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
