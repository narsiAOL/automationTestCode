import type { ReactNode } from "react";
import MainBg from "./ui/MainBg";
import DesignTop from "./Login/DesignTop";
import DesignBottom from "./Login/DesignBottom";
import "../styles/AuthLayout.css";
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-background w-full h-full min-h-screen">
      <MainBg />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8">
        <div className="flex flex-col items-center justify-center w-full max-w-md lg:max-w-none mx-auto gap-6">
          <DesignTop className="design-top  z-1" />
          <div className="auth-container min-h-[400px] flex items-center justify-center">
            {children}
          </div>
          <DesignBottom className="design-bottom z-1" />
        </div>
      </div>
    </div>
  );
}
