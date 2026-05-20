// import React from "react";
// import OrnamentalFlower from "./OrnamentalFlower";

// interface SectionTitleProps {
//   title: string;
//   className?: string;
// }

// export default function SectionTitle({
//   title,
//   className = "",
// }: SectionTitleProps) {
//   return (
//     <div
//       className={`flex items-center justify-center gap-3 md:gap-2.5 lg:gap-3 px-3 py-1 ${className}`}
//     >
//       <OrnamentalFlower className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
//       <h1 className="text-heading-3 md:text-heading-4 lg:text-heading-3 text-text-main font-bold text-center capitalize">
//         {title}
//       </h1>
//       <OrnamentalFlower className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
//     </div>
//   );
// }

import React from "react";
import GreenLeftArrowIcon from "./GreenLeftArrow";
import GreenRightArrowIcon from "./GreenRightArrow";

interface SectionTitleProps {
  title: string;
  className?: string;
  onClick?: () => void;
}

export default function SectionTitle({
  title,
  className = "",
  onClick,
}: SectionTitleProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center gap-3 md:gap-2.5 lg:gap-3 px-3 py-1 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <GreenLeftArrowIcon className="w-10 h-10 flex-shrink-0" />

      <h1 className="text-heading-3 md:text-heading-4 lg:text-heading-3 text-text-main font-bold text-center capitalize">
        {title}
      </h1>

      <GreenRightArrowIcon className="w-10 h-10 flex-shrink-0" />
    </div>
  );
}
