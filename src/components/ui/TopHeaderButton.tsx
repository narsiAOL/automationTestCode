import React from "react";

interface TopHeaderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function TopHeaderButton({
  children,
  onClick,
  className = "",
}: 
TopHeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        px-4 py-2
        text-button-topheader
        rounded-md
        
        transition-colors duration-300
        bg-[#9C845533] text-[#F0D898]

        ${className}
      `} >
      {children}
    </button>
  );
}
