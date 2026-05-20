import React from "react";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}

export default function IconButton({
  children,
  onClick,
  className = "",
  title,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="
        w-8 h-8 flex items-center justify-center
        rounded-md
        cursor-pointer
        transition-colors duration-200
        bg-[#EDE7DA]
        hover:bg-[#FBF7F3]
        active:bg-[#EDE7DA]
        text-[#3D362A]
      "
    >
      {children}
    </button>
  );
}