interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    children,
    className,
    ...props
}: ButtonProps) {
    const baseStyles = "font-bold py-2 px-4 rounded";
    const variants = {
        primary: "bg-blue-500 hover:bg-blue-700 text-white",
        secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
        danger: "bg-red-500 hover:bg-red-700 text-white",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
