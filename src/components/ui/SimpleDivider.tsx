interface SimpleDividerProps {
    className?: string;
    color?: string;
  }
  
  export default function SimpleDivider({
    className = "",
    color = "#D9B869",
  }: SimpleDividerProps) {
    return (
      <svg
        viewBox="0 0 423 1"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={className}
        style={{ display: "block", width: "100%", height: "1px" }}
      >
        <path
          d="M421.196 1L1.80357 1C0.841655 1 0 0.779662 0 0.491526C0 0.22034 0.781536 0 1.80357 0L421.196 0C422.158 0 423 0.22034 423 0.491526C422.94 0.779662 422.158 1 421.196 1Z"
          fill={color}
          opacity="0.4"
        />
      </svg>
    );
  }