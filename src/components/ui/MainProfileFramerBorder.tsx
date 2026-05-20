import React from "react";

export default function MainProfileFramerBorder() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 372 540"
      preserveAspectRatio="none"
    >
      {/* <ellipse
        cx="186" // half of 372
        cy="270" // half of 540
        rx="180" // horizontal radius
        ry="265" // vertical radius
        stroke="url(#paint0_linear_11_5865)"
        strokeWidth="6"
        fill="none"
      /> */}

      <defs>
        <linearGradient
          id="paint0_linear_11_5865"
          x1="0"
          y1="0"
          x2="0"
          y2="540"
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
