import React, { useState } from "react";

interface AddBhaktiGeetButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function AddBhaktiGeetButton({
  children,
  onClick,
  className = "",
}: AddBhaktiGeetButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={`
        relative flex items-center justify-center
        text-button-download
        w-[168px] h-[44px]
        gap-[8px]
        px-[24px] py-[10px]
        rounded-[8px]
        bg-[#1738BA] text-[#F5F1E7]
        border-b-[1px] border-[#071448]
        transition-colors duration-300
        hover:opacity-90
        cursor-pointer
        ${isActive ? "opacity-70" : ""}
        ${className}
      `}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
