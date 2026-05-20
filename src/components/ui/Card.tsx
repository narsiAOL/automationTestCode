import type { ReactNode } from "react";
import OrnamentalBorder from "./OrnamentalBorder";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "light" | "dark";
}

export default function Card({
  children,
  className = "",
  variant = "light",
}: CardProps) {
  return (
    <div
      className={`ornamental-card ${className} bg-background-card border border-primary-400/50 shadow-sm rounded-sm`}
    >
      {/* Ornamental Border Background */}
      {/* <OrnamentalBorder variant={variant} /> */}

      {/* Content Wrapper */}
      <div className="ornamental-card-content">{children}</div>
    </div>
  );
}
