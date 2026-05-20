import React, { useRef, useState, useEffect, type KeyboardEvent } from "react";

interface VerificationCodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onCodeChange?: (code: string) => void;
  className?: string;
}

export default function VerificationCodeInput({
  length = 6,
  onComplete,
  onCodeChange,
  className = "",
}: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(length).fill(null)
  );

  useEffect(() => {
    const codeString = code.join("");
    onCodeChange?.(codeString);

    if (codeString.length === length && !codeString.includes("")) {
      onComplete(codeString);
    }
  }, [code, length, onComplete, onCodeChange]);

  const handleChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits.length > 0) {
      const newCode = new Array(length).fill("");
      for (let i = 0; i < digits.length && i < length; i++) {
        newCode[i] = digits[i];
      }
      setCode(newCode);

      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={`flex gap-2 items-center justify-center ${className}`}>
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-text-main text-input bg-primary-100 border border-border-light rounded focus:border-border-dark focus:outline-none transition-colors duration-200 relative overflow-hidden"
        />
      ))}
    </div>
  );
}
