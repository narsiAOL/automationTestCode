export default function DividerDesign({
  color = "light",
  className = "",
}: {
  color?: "light" | "dark";
  className?: string;
}) {
  // Use the exact gold color from the SVG spec
  // color prop kept for API compatibility but visuals always use brand gold
  const fill = "#B47F3A";

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ height: 6 }}
    >
      {/* Full-width line — absolute so parent flex/width never affects it */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 14,
          right: 14,
          height: 1.4,
          transform: "translateY(-50%)",
          backgroundColor: fill,
          opacity: 0.22,
        }}
      />

      {/* Left small dot (cx=2, r=2) */}
      <div style={{
        position: "absolute", top: "50%", left: 0,
        width: 4, height: 4, borderRadius: "50%",
        transform: "translateY(-50%)",
        backgroundColor: fill, opacity: 0.22,
      }} />

      {/* Left large dot (cx=9, r=3) */}
      <div style={{
        position: "absolute", top: "50%", left: 6,
        width: 6, height: 6, borderRadius: "50%",
        transform: "translateY(-50%)",
        backgroundColor: fill, opacity: 0.22,
      }} />

      {/* Right large dot (cx=763, r=3) */}
      <div style={{
        position: "absolute", top: "50%", right: 6,
        width: 6, height: 6, borderRadius: "50%",
        transform: "translateY(-50%)",
        backgroundColor: fill, opacity: 0.22,
      }} />

      {/* Right small dot (cx=770, r=2) */}
      <div style={{
        position: "absolute", top: "50%", right: 0,
        width: 4, height: 4, borderRadius: "50%",
        transform: "translateY(-50%)",
        backgroundColor: fill, opacity: 0.22,
      }} />
    </div>
  );
}