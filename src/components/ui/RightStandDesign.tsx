import rightStandDesign from "../../assets/svgs/right-stand-design.svg";

export default function RightStandDesign() {
  return (
    <div
      className="hidden md:block fixed right-0 md:top-[1rem] lg:top-[2rem] pointer-events-none z-[var(--z-index-layout-design)]"
      style={{
        // width: "225px",
        transform: "translateX(30px)",
      }}
    >
      {/* Main decorative stand design */}
      <div className="h-full flex items-start justify-end flex-shrink-0">
        <img
          src={rightStandDesign}
          alt=""
          className="h-full w-full object-contain object-right-top"
        />
      </div>
    </div>
  );
}
