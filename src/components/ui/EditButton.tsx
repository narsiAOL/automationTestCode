import React from "react";

interface EditButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function EditButton({
  children,
  onClick,
  className = "",
}: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        px-4 py-2
        text-edit-button
        rounded-md
        cursor-pointer
        transition-colors duration-300

        bg-transparent text-[#1738BA]   /* Default */

        hover:bg-[#9C84551A] hover:text-[#1738BA]  /* Hover */
        active:bg-[#9C84551A] active:text-[#1738BA] /* Active */

        ${className}
      `}
    >
      {children}
    </button>
  );
}
