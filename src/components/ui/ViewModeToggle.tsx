import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface ViewModeOption {
  label: string;
  value: string;
}

export interface ViewModeToggleProps {
  className?: string;
  disabled?: boolean;
  gridOptions?: ViewModeOption[];
  listOptions?: ViewModeOption[];
  selectedGridOption?: string;
  selectedListOption?: string;
  onGridOptionChange?: (option: string) => void;
  onListOptionChange?: (option: string) => void;
  onGridClick?: () => void;
  onListClick?: () => void;
}

export default function ViewModeToggle({
  className = "",
  disabled = false,
  gridOptions = [],
  listOptions = [],
  selectedGridOption,
  selectedListOption,
  onGridOptionChange,
  onListOptionChange,
  onGridClick,
  onListClick,
}: ViewModeToggleProps) {
  const [openDropdown, setOpenDropdown] = useState<"grid" | "list" | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const gridButtonRef = useRef<HTMLButtonElement>(null);
  const listButtonRef = useRef<HTMLButtonElement>(null);

  // Recalculate dropdown position whenever it opens
  useEffect(() => {
    if (!openDropdown) return;

    const buttonRef = openDropdown === "grid" ? gridButtonRef : listButtonRef;
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 150;
    const viewportWidth = window.innerWidth;

    const top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX;

    // Shift left if it would overflow the right edge
    if (left + dropdownWidth > viewportWidth) {
      left = viewportWidth - dropdownWidth - 8;
    }

    setDropdownStyle({ position: "absolute", top, left, width: dropdownWidth, zIndex: 9999 });
  }, [openDropdown]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGridClick = () => {
    if (disabled) return;
    setViewMode("grid");
    onGridClick?.();
    setOpenDropdown(openDropdown === "grid" ? null : "grid");
  };

  const handleListClick = () => {
    if (disabled) return;
    setViewMode("list");
    onListClick?.();
    setOpenDropdown(openDropdown === "list" ? null : "list");
  };

  const renderDropdown = (
    type: "grid" | "list",
    options: ViewModeOption[],
    selectedOption: string | undefined,
    onOptionChange?: (value: string) => void
  ) => {
    if (openDropdown !== type || options.length === 0) return null;

    return createPortal(
      <div
        style={dropdownStyle}
        className="bg-white border border-[#A371034D] rounded-[16px] shadow-lg"
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onOptionChange?.(option.value);
              setOpenDropdown(null);
            }}
            className={`w-full text-left px-4 py-2 first:rounded-t-[16px] last:rounded-b-[16px] transition-colors duration-200 ${
              selectedOption === option.value
                ? "bg-[#FFF4E6] text-[#A37103] font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>,
      document.body
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center border border-[#d4c4a0] rounded-lg bg-[#f5efe0] flex-shrink-0 ${className}`}
    >
      {/* Grid button */}
      <button
        ref={gridButtonRef}
        onClick={handleGridClick}
        disabled={disabled}
        aria-label="Grid view"
        className={`p-2 rounded-lg transition-colors touch-manipulation ${
          viewMode === "grid"
            ? "bg-[#3b2a14] text-white"
            : "text-[#3b2a14] hover:bg-[#ede5d0]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>

      {renderDropdown("grid", gridOptions, selectedGridOption, onGridOptionChange)}

      {/* List button (uncomment to enable) */}
      {/* <button
        ref={listButtonRef}
        onClick={handleListClick}
        disabled={disabled}
        aria-label="List view"
        className={`p-2 rounded-r-md transition-colors touch-manipulation ${
          viewMode === "list"
            ? "bg-[#3b2a14] text-white"
            : "text-[#3b2a14] hover:bg-[#ede5d0]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {renderDropdown("list", listOptions, selectedListOption, onListOptionChange)} */}
    </div>
  );
}