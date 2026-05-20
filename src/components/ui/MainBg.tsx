import MainBackground from "../../assets/svgs/main-bg.svg";
export default function MainBg({className}: {className?: string}) {
  return (
    <img
      src={MainBackground}
      alt="mainbg"
      className={`fixed left-0 top-0 w-full h-full object-cover max-w-screen min-h-screen opacity-50 ${className}`}
    />
  );
}
