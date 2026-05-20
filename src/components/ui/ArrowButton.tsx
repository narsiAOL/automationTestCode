interface ArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ArrowButton({
  direction,
  onClick,
  disabled = false,
  className = "",
}: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        arrow-button 
        ${disabled ? "arrow-button-disabled" : "arrow-button-enabled"}
        ${className}
      `}
      aria-label={`${direction === "left" ? "Previous" : "Next"} tab`}
    >
      {direction === "left" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-icon"
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-icon"
        >
          <path
            d="M7.5 5L12.5 10L7.5 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
