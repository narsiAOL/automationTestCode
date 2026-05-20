import { useState, useRef, useEffect } from "react";

export interface SortKey {
  label: string;
  value: string;
}

export interface SortOrder {
  label: string;
  value: "asc" | "desc";
}

export interface FunctionalButtonProps {
  leftText?: string;
  className?: string;
  disabled?: boolean;
  sortKeys?: SortKey[];
  selectedSortKey?: string;
  onSortKeyChange?: (sortKey: string) => void;
}

export default function FunctionalButton({
  leftText = "Filter",
  className = "",
  disabled = false,
  sortKeys = [],
  selectedSortKey,
  onSortKeyChange,
}: FunctionalButtonProps) {
  const [openDropdown, setOpenDropdown] = useState<"filter" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterClick = () =>
    setOpenDropdown(openDropdown === "filter" ? null : "filter");

  return (
    <div ref={containerRef} className={`inline-flex ${className}`}>
      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={handleFilterClick}
          disabled={disabled}
          className={`
            h-10 px-4 rounded-[16px] border-2 border-[#A371034D] bg-[#FFFAF0]
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90 active:opacity-80"}
          `}
        >
          {leftText}
        </button>

        {openDropdown === "filter" && sortKeys.length > 0 && (
          <div className="absolute top-full mt-2 z-50 w-44 md:w-[170px] bg-white border rounded-[16px] shadow-lg overflow-hidden left-0 right-0 md:left-auto md:right-0  ">
            {sortKeys.map((sortKey) => (
              <button
                key={sortKey.value}
                onClick={() => onSortKeyChange?.(sortKey.value)}
                className={`
                  w-full text-left px-4 py-2.5 transition-colors duration-200
                  ${selectedSortKey === sortKey.value ? "bg-[#FFF4E6] text-[#A37103] font-medium" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                {sortKey.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
