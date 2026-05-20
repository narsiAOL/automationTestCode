export default function VerticalDividerDesign({
    color = "light",
    className = "",
  }: {
    color?: "light" | "dark";
    className?: string;
  }) {
    const fillColor =
      color === "light" ? "var(--border-light)" : "var(--border-dark)";
  
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 772 6"
        fill="none"
        preserveAspectRatio="none"
        className={className}
        style={{
          display: "block",
          height: "100%",
          width: "6px",
          transform: "rotate(90deg)",
        }}
      >
        <g opacity="0.22">
          <path
            d="M6 3C6 4.66667 7.3333 6 8.99997 6C10.6666 6 12 4.66667 12 3C12 1.36364 10.6666 0 8.99997 0C7.36361 0.030303 6 1.36364 6 3Z"
            fill={fillColor}
          />
          <path
            d="M0 3C0 4.11429 0.88571 5 2 5C3.11429 5 4 4.11429 4 3C4 1.88571 3.11429 1 2 1C0.88571 1 0 1.91428 0 3Z"
            fill={fillColor}
          />
          <path
            d="M754.828 3.70078L17.1722 3.70078C15.4804 3.70078 14 3.39231 14 2.98892C14 2.60926 15.3746 2.30078 17.1722 2.30078L754.828 2.30078C756.52 2.30078 758 2.60926 758 2.98892C757.894 3.39231 756.52 3.70078 754.828 3.70078Z"
            fill={fillColor}
          />
          <path
            d="M766 3C766 4.66667 764.667 6 763 6C761.333 6 760 4.66667 760 3C760 1.36364 761.333 0 763 0C764.636 0.030303 766 1.36364 766 3Z"
            fill={fillColor}
          />
          <path
            d="M772 3C772 4.11429 771.114 5 770 5C768.886 5 768 4.11429 768 3C768 1.88571 768.886 1 770 1C771.114 1 772 1.91428 772 3Z"
            fill={fillColor}
          />
        </g>
      </svg>
    );
  }