import leftStandDesign from "../../assets/svgs/left-stand-design.svg";

export default function LeftStandDesign() {
  return (
    <div
      className="hidden md:block fixed left-0 md:top-[1rem] lg:top-[2rem] pointer-events-none z-[var(--z-index-layout-design)]"
      style={{
        // width: "225px",
        transform: "translateX(-30px)",
      }}
    >
      {/* Main decorative stand design */}
      <div className="h-full flex items-start justify-start md:flex-shrink-0">
        <img
          src={leftStandDesign}
          alt=""
          className="h-full w-full object-contain object-left-top"
        />
      </div>
    </div>
  );
}
