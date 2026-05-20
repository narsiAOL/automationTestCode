import React from "react";
import IconButton from "../IconButton";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentZoom?: number;
}

const ZoomInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="#3D362A" strokeWidth="1.5" />
    <path
      d="M7.5 4.5v6M4.5 7.5h6"
      stroke="#3D362A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="m13.5 13.5 3 3"
      stroke="#3D362A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ZoomOutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="#3D362A" strokeWidth="1.5" />
    <path
      d="M4.5 7.5h6"
      stroke="#3D362A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="m13.5 13.5 3 3"
      stroke="#3D362A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function ZoomControls({
  onZoomIn,
  onZoomOut,
  currentZoom,
}: ZoomControlsProps) {
  return (
    <div
      className="
        flex flex-col items-center
        gap-1 sm:gap-2
        p-1
        rounded-lg
        bg-[#EDE7DA]
      "
      data-name="Zoom Controls"
    >
      {/* Zoom In */}
      <IconButton
        onClick={onZoomIn}
        title="Zoom In"
        className="
          w-[40px] h-[40px] sm:w-[44px] sm:h-[44px]
          flex items-center justify-center
          p-1
          hover:bg-[#FBF7F3] active:bg-[#FBF7F3]
          rounded-md
          touch-manipulation
        "
      >
        <ZoomInIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </IconButton>

      {/* Divider */}
      <div
        className="w-[30px] sm:w-[36px] my-0.5 sm:my-1"
        style={{ height: "0px", border: "1px solid #3D2B1F1F" }}
      />

      {/* Zoom Out */}
      <IconButton
        onClick={onZoomOut}
        title="Zoom Out"
        className="
          w-[40px] h-[40px] sm:w-[44px] sm:h-[44px]
          flex items-center justify-center
          p-1
          hover:bg-[#FBF7F3] active:bg-[#FBF7F3]
          rounded-md
          touch-manipulation
        "
      >
        <ZoomOutIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </IconButton>
    </div>
  );
}