import LoginDesignBottom from "../../assets/svgs/login-design-bottom.svg";
export default function DesignBottom({
  className = "",
}: {
  className?: string;
}) {
  return (
    <img
      src={LoginDesignBottom}
      alt="design top"
      className={`design-bottom ${className}`}
    />
  );
}
