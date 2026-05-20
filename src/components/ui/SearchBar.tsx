import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";

interface SearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Variant theme - dark (default) or light */
  variant?: "dark" | "light";
  /** Additional CSS classes */
  className?: string;
  /** Input value */
  value?: string;
  /** Loading state */
  loading?: boolean;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Click handler for search icon */
  onSearch?: () => void;
}

// Search icon SVG component
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19.25 19.25L15.5 15.5M17.75 10.125C17.75 14.3331 14.3331 17.75 10.125 17.75C5.91687 17.75 2.5 14.3331 2.5 10.125C2.5 5.91687 5.91687 2.5 10.125 2.5C14.3331 2.5 17.75 5.91687 17.75 10.125Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SearchBar({
  placeholder = "Search by Kutumbh No., Page no, Name, etc",
  variant = "dark",
  className = "",
  loading = false,
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  const { t } = useTranslation();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.();
    }
  };

  const handleIconClick = () => {
    onSearch?.();
  };

  // Style variants removed since we’re overriding colors
  const containerStyles = "relative flex items-center bg-[#EBE0C5] border border-[#9C845566] rounded-md";
  const textStyles = "text-[#95511C] placeholder:text-[#95511C]";
  const iconStyles = "text-[#95511C]";

  return (
    <div className={`search-bar ${containerStyles} ${className}`}>
      {/* Search Icon */}
      <button
        type="button"
        onClick={handleIconClick}
        className={`search-icon ${iconStyles}`}
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" />
      </button>

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder || t("ui.searchPlaceholder") || ""}
        className={`search-input flex-1 ml-2 ${textStyles} bg-transparent border-none outline-none`}
      />

      {/* Loader for loading state */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader spinnerClassName="!w-5 !h-5" />
        </div>
      )}
    </div>
  );
}
