// interface HorizontalDividerProps {
//   className?: string;
// }

// export default function HorizontalDivider({
//   className = "",
// }: HorizontalDividerProps) {
//   return <div className={`!h-px w-full bg-border-light ${className}`} />;
// }


import DividerDesign from "./DividerDesign";

interface HorizontalDividerProps {
  className?: string;
  color?: "light" | "dark"; // optional color prop
}

export default function HorizontalDivider({
  className = "",
  color = "light",
}: HorizontalDividerProps) {
  // Simply render the DividerDesign SVG
  return <DividerDesign color={color} className={className} />;
}
