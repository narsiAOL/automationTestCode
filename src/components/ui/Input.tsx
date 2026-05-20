import React, { useState } from "react";

interface InputProps {
  type?: "text" | "email" | "password";
  label?: string;
  error?: string | null;
  setError: (args: any) => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
  onValidation?: (isValid: boolean, errorMessage: string) => void;
  shouldValidate?: boolean;
}

export default function Input({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error = "",
  setError,
  className = "",
  required = false,
  onValidation,
  shouldValidate = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.trim() === "" && newValue.length > 0) {
      return;
    }
    setError("");
    setInternalValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  // Simple eye icon SVG
  const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="cursor-pointer text-text-main hover:opacity-80"
      onClick={togglePasswordVisibility}
    >
      {isVisible ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  return (
    <div className={`flex flex-col gap-2 w-full ${className} relative pb-6`}>
      {label && (
        <label className="text-label text-primary-600 tracking-[-0.16px]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={internalValue}
          onChange={handleChange}
          // onBlur={handleBlur}
          className={`w-full h-12 px-3 py-1 bg-primary-100 border rounded-[4px] text-sm font-normal text-text-main placeholder:text-text-labels placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
            error ? "border-red-500 focus:ring-red-500" : "border-border-light"
          }`}
        />
        {type === "password" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <EyeIcon isVisible={showPassword} />
          </div>
        )}
      </div>
      {error && (
        <span className="absolute bottom-0 left-0 text-sm text-red-600">
          {error || "error"}
        </span>
      )}
    </div>
  );
}
