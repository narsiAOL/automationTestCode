import React from "react";

export default function BusinessProfileFrameBorder() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 346 346"
      fill="none"
    >
      <circle
        cx="173"
        cy="173"
        r="170" // leave ~3px padding for stroke
        stroke="url(#paint0_linear)"
        strokeWidth="6"
        fill="none"
      />

      <defs>
        <linearGradient
          id="paint0_linear"
          x1="0"
          y1="0"
          x2="0"
          y2="346"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.07" stopColor="#B47F3A" />
          <stop offset="0.44" stopColor="#733E0A" />
          <stop offset="1" stopColor="#8C5B2A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
