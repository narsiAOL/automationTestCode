import React, { useState, useRef, useEffect } from "react";

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  background?: string; // CSS color or Tailwind class
  textColor?: string;
  borderRadius?: string; // CSS color or Tailwind class
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  className = "",
  error,
  background = "#ebe0c5",
  textColor = "#aa7546",
  borderRadius = "0.375rem", // default to Tailwind's rounded
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      setOpen(true);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div
      ref={containerRef}
      className={`form-input-container relative ${className}`.trim()}
    >
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        tabIndex={0}
        className={`form-select appearance-none cursor-pointer flex items-center px-3 py-2 rounded border${error ? " border-red-400" : " border-yellow-600"} w-full`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        role="button"
        style={{
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
          background: background,
          color: textColor,
          borderRadius: borderRadius,
        }}
      >
        <span
          style={{ color: textColor }}
          className={`flex-1 min-w-0 truncate ${value ? "" : "text-gray-400"}`}
        >
          {selectedLabel || placeholder}
        </span>
        {/* Only one arrow, always rendered here */}
        <span className="flex-shrink-0 flex items-center justify-end">
          <svg
            className="ml-2 w-4 h-4 pointer-events-none"
            fill="none"
            stroke={textColor}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
      {open && (
        <ul
          className="absolute z-50 left-0 right-0 top-full mt-1 border border-gray-300 rounded shadow-lg max-h-60 overflow-auto bg-white custom-scrollbar"
          tabIndex={-1}
          role="listbox"
        >
          <li
            className="px-4 py-2 text-black cursor-default select-none"
            aria-disabled="true"
          >
            {placeholder}
          </li>
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100${option.value === value ? " bg-gray-200 font-semibold" : ""}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
