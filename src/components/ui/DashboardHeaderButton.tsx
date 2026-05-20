import React from "react";

interface DashboardHeaderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean; // Pass active state from parent
}

export default function DashboardHeaderButton({
  children,
  onClick,
  className = "",
  isActive = false,
}: DashboardHeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        px-6 py-3
        rounded-md
        cursor-pointer
        transition-colors duration-300

        ${isActive
          ? "bg-[#3D2B1F] text-edit-button text-[#F5F0E6]"
          : "bg-transparent text-button-dashboard text-[#3D362A] hover:bg-[#9C84551A] hover:text-[#3D362A]"
        }

        ${className}
      `}
    >
      {children}
    </button>
  );
}