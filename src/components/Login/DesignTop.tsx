import LoginDesignTop from "../../assets/svgs/login-design-top.svg";
export default function DesignTop({ className = "" }: { className?: string }) {
  return (
    <img src={LoginDesignTop} alt="design top" className={` ${className}`} />
  );
}
