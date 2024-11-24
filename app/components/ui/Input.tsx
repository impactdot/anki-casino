interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <input
        className={`w-full p-2 rounded border border-[var(--input-border)] 
          bg-[var(--input-background)] text-[var(--input-foreground)] ${className}`}
        {...props}
      />
    </div>
  );
}
