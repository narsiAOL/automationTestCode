import TabBg from "./TabBg";

interface TabProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Tab({
  children,
  isActive = false,
  onClick,
  className = "",
}: TabProps) {
  return (
    <div
      className={`relative flex items-center justify-center h-11 md:h-9 lg:h-11 px-5 py-0 cursor-pointer transition-all duration-200 hover:scale-105 min-w-0 ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {isActive && (
        <TabBg className="absolute inset-0 w-full" variant={"dark"} />
      )}

      <span
        className={`relative z-10 text-button-large md:text-button lg:text-button-large font-medium min-w-0 ${
          isActive ? "text-primary-100" : "text-text-main"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
