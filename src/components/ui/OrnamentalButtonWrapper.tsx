import React from "react";
import secondaryButton from "../../assets/svgs/button-secondary.svg";
export default function OrnamentalButtonWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full h-full flex justify-center items-center p-4 text-button-large ${
        className || ""
      }`}
    >
      <svg
        className="absolute inset-0 w-full h-full z-0"
        preserveAspectRatio="none"
        width={"100%"}
        height={"100%"}
        viewBox="0 0 100 100"
      >
        <image
          href={secondaryButton}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        />
      </svg>
      <span
        className={`relative z-1 text-center text-text-main text-button-large`}
      >
        {children}
      </span>
    </div>
  );
}
