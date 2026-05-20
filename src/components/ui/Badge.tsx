interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center justify-center px-2 py-[5px] rounded-full text-badge  uppercase  !text-xs text-primary-100";

  const variantClasses = {
    default: "bg-primary-600 text-primary-100",
    primary: "bg-primary-500 text-primary-100",
    secondary: "bg-primary-400 text-text-main",
  };

  return (
    <span className={`${baseClasses}  ${className} relative`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 70 32"
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full z-0"
      >
        <path
          d="M35.0001 32C20.2787 27.7684 19.1761 28.2236 5.7753 29.7204L0 25.7163V6.2838L5.7753 2.27964C21.8399 4.07418 22.6708 3.54445 35.0001 0C47.3182 3.54123 48.2328 4.06605 64.2249 2.27964L70 6.2838V25.7163L64.2249 29.7204C50.7012 28.2099 49.5547 27.8161 35.0001 32Z"
          fill="url(#paint0_linear_50_11087)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_50_11087"
            x1="35"
            y1="0"
            x2="35"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#C2C06A" />
            <stop offset="1" stop-color="#93913B" />
          </linearGradient>
        </defs>
      </svg>
      <span className="z-1">{children}</span>
    </span>
  );
}
