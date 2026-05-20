import type { SVGProps } from "react";

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor" />
    </svg>
  );
}

export function PreviousIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6 6H8V18H6V6ZM9.5 12L18 6V18L9.5 12Z" fill="currentColor" />
    </svg>
  );
}

export function NextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M16 18H18V6H16V18ZM6 6V18L14.5 12L6 6Z" fill="currentColor" />
    </svg>
  );
}

export function ShuffleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.59 9.17L5.41 4L4 5.41L9.17 10.58L10.59 9.17ZM14.5 4L16.54 6.04L4.41 18.17L5.82 19.58L17.96 7.46L20 9.5V4H14.5ZM14.83 13.41L13.42 14.82L16.54 17.96L14.5 20H20V14.5L17.96 16.54L14.83 13.41Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function VolumeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function RepeatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SkipBackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11 18V6L14.5 12L11 18ZM6 6V18H8V6H6Z" fill="currentColor" />
      <text
        x="4"
        y="16"
        fontSize="8"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        10
      </text>
    </svg>
  );
}

export function SkipForwardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13 6V18L9.5 12L13 6ZM16 6V18H18V6H16Z" fill="currentColor" />
      <text
        x="14"
        y="16"
        fontSize="8"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        10
      </text>
    </svg>
  );
}
