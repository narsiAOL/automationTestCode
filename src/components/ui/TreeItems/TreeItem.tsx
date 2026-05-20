import React from "react";
import TreeItemBorder from "./TreeItemBorder";
import LeavesFrameTop from "../../../assets/icons/LeavesFrameTop";
import LeavesFrameBottom from "../../../assets/icons/LeavesFrameBottom";

export default function TreeItem({
  image = "/mainprofile.png",
  name,
  className = "",
}: {
  image?: string;
  name?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full h-full ${className} `}>
      {/* Top leaves frame - positioned relative to the border */}
      {/* <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[138%] h-[26%]">
        <LeavesFrameTop />
      </div> */}
      {/* Bottom leaves frame - positioned relative to the border */}
      {/* <div className="absolute -bottom-[4%] left-1/2 -translate-x-1/2 w-[138%] h-[25%]">
        <LeavesFrameBottom />
      </div> */}
      {/* Outer border */}
      <TreeItemBorder />

      {/* Inner clipped image with gap */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 53 80"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] h-[96%]" // perfectly center the image
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <clipPath id="treeItemClip" clipPathUnits="objectBoundingBox">
            <path
              d="
                M0.5 0.99
                C0.39 0.99 0.29 0.95 0.23 0.88
                H0.02V0.12H0.23
                C0.29 0.05 0.39 0.01 0.5 0.01
                C0.61 0.01 0.71 0.05 0.77 0.12
                H0.98V0.88H0.77
                C0.71 0.95 0.61 0.99 0.5 0.99Z
              "
            />
          </clipPath>
        </defs>

        <image
          href={image}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#treeItemClip)"
          className="object-cover object-left"
        />
      </svg>

      {/* Name below the image */}
      {/* {name && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center px-2">
          <span className="text-sm font-medium text-white line-clamp-1">
            {name}
          </span>
        </div>
      )} */}
    </div>
  );
}
