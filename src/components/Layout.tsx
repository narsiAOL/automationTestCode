import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
// import LeftStandDesign from "./ui/LeftStandDesign";
// import RightStandDesign from "./ui/RightStandDesign";
import MainBg from "./ui/MainBg";
import GlobalAudioPlayer from "./GlobalAudioPlayer";
import { Link } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isPrivacyPolicy = location.pathname === "/privacy-policy";
  return (
    <div
      className="relative min-h-screen max-h-none"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* <MainBg /> */}
      {/* Header/Navigation will go here */}
      <Header />

      {/* Main content area with stand designs */}
      <main className="relative p-4 pt-12 md:px-6 pt-6 pb-6 xl:px-24 pt-24 pb-6 xl:pb-12 min-h-screen max-h-none h-full main-content-with-player">
        {/* Left decorative stand design */}
        {/* <LeftStandDesign /> */}

        {/* Right decorative stand design */}
        {/* <RightStandDesign /> */}

        {/* Main content - positioned between the stands */}
        <div className="relative lg:mx-auto lg:max-w-8xl mt-12">
          <Outlet />
        </div>
      </main>
      {!isPrivacyPolicy && (
        <div className="absolute bottom-0 right-0 flex justify-end mb-8 mr-8 gap-2">
          <Link to="/privacy-policy">
            <p className="text-end text-xs text-gray-500 ">Privacy Policy</p>
          </Link>
          <div className="h-4 border-r border-slate-400"></div>
          <Link to="/child-safety">
            <p className="text-end flex text-xs text-gray-500 items-center gap-1">
              Child Safety
            </p>
          </Link>
        </div>
      )}

      {/* Global Audio Player - fixed at bottom */}
      <GlobalAudioPlayer />
    </div>
  );
}
