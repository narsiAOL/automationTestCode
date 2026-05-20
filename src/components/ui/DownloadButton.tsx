import React, { useState } from "react";

interface DownloadButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function DownloadButton({
  children,
  onClick,
  className = "",
}: DownloadButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={`
        relative flex items-center justify-center
        px-6 py-3
        text-button-download
        rounded-md border border-[#1738BA]
        bg-[#ECEDF9] text-[#1738BA]
        transition-colors duration-300
        hover:bg-[#1738BA] hover:text-white
        ${isActive ? "bg-[#9C845533] text-[#F0D898]" : ""}
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
