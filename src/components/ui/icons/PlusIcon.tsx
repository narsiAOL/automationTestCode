import React from "react";

interface PlusIconProps {
  className?: string;
  color?: string;
}

export default function PlusIcon({
  className,
  color = "#e2c675",
}: PlusIconProps) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 4.583v12.834M4.583 11h12.834"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
