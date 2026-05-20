import TopHeaderButton from "./TopHeaderButton";
import FlowIcon from "../../assets/svgs/flow-icon.svg";

interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "outlined" | "danger";
  children: React.ReactNode;
  className?: string;
  onClick?: (args?: any) => void;
  disabled?: boolean;
}

const baseInteraction = `
  cursor-pointer select-none
  transition-all duration-200
  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
`;

export default function Button({
  variant = "primary",
  children,
  className = "",
  onClick,
  disabled = false,
}: ButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  /* ── Primary ─────────────────────────────────────────────────────────── */
  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
          inline-flex items-center justify-center
          bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] active:scale-[0.98]
          text-white font-medium font-sans text-sm
          rounded-lg px-4 py-2 w-full
          focus-visible:ring-[var(--color-primary-400)]
          ${baseInteraction} ${className}
        `}
      >
        {children}
      </button>
    );
  }

  /* ── Tertiary ── */
  if (variant === "tertiary") {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center justify-center
          active:scale-[0.98]
          text-white font-medium font-sans text-sm
          rounded-lg px-4 py-2 w-full
          focus-visible:ring-blue-400
          ${baseInteraction} ${className}
        `}
        style={{
          background: "#1738BA",
          borderBottom: "1px solid #071448",
        }}
      >
        {children}
      </button>
    );
  }

  /* ── Outlined ── */
  if (variant === "outlined") {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center justify-center
          active:scale-[0.98]
          rounded-lg px-3 py-2
          font-medium font-sans text-sm
          focus-visible:ring-blue-400
          ${baseInteraction} ${className}
        `}
        style={{
          background: "#ECEDF9",
          border: "1px solid #1738BA",
        }}
      >
        {children}
      </button>
    );
  }
  /* ── Danger ── */
  if (variant === "danger") {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center justify-center
          active:scale-[0.98]
          rounded-lg px-3 py-2
          font-medium font-sans text-sm text-[#86181D]
          hover:bg-[#FEE2E2]
          focus-visible:ring-red-400
          ${baseInteraction} ${className}
        `}
        style={{
          background: "#FEE2E2",
          border: "1px solid #BE141C",
          color: "#86181D",
        }}
      >
        {children}
      </button>
    );
  }

  /* ── Secondary / TopHeader fallback ─────────────────────────────────── */
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer w-full h-full flex items-center justify-center ${className}`}
    >
      <TopHeaderButton className={className}>{children}</TopHeaderButton>
    </button>
  );
}
