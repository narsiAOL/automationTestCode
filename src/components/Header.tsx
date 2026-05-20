import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeaderBg from "./ui/HeaderBg";
import SearchBar from "./ui/SearchBar";
import TopHeaderButton from "./ui/TopHeaderButton";
import DownloadButton from "./ui/DownloadButton";
import OrnamentalButtonWrapper from "./ui/OrnamentalButtonWrapper";
import { LanguageSwitcher, ThemeToggle } from "./ui";
import { navItems, getActiveNavItem } from "../utils/navConfig";
import Divider from "./ui/Divider";
import { useAuth } from "../contexts/AuthContext";
// import Logo from "../assets/svgs/logo.svg";
import Logo from "../assets/svgs/Logo-header-1.svg";
import FallbackImage from "../assets/svgs/fallback-image.svg";
interface NavLinkProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

// function NavLink({ label, isActive, onClick }: NavLinkProps) {
//   if (isActive) {
//     return (
//       <OrnamentalButtonWrapper className="h-8 md:h-9 lg:h-10 xl:h-11 flex items-center justify-center">
//         <button
//           onClick={onClick}
//           className="text-text-main font-sans font-medium text-xs md:text-sm lg:text-base xl:text-button-large whitespace-nowrap px-1.5 md:px-2 lg:px-3 xl:px-4"
//         >
//           {label}
//         </button>
//       </OrnamentalButtonWrapper>
//     );
//   }

//   return (
//     <div className="h-8 md:h-9 lg:h-10 xl:h-11 flex items-center justify-center cursor-pointer">
//       <button
//         onClick={onClick}
//         className="px-1.5 md:px-2 lg:px-3 xl:px-4 py-1.5 md:py-2 flex items-center justify-center text-text-link-light font-sans font-medium text-xs md:text-sm lg:text-base xl:text-button-large leading-4 md:leading-5 lg:leading-6 tracking-[-0.16px] whitespace-nowrap rounded-lg cursor-pointer hover:-translate-y-0.25 transition-transform duration-300"
//       >
//         {label}
//       </button>
//     </div>
//   );
// }

function NavLink({ label, isActive, onClick }: NavLinkProps) {
  if (isActive) {
    return (
      <TopHeaderButton
        onClick={onClick}
        className="h-8 md:h-9 lg:h-10 xl:h-11 flex items-center justify-center w-full"
      >
        {label}
      </TopHeaderButton>
    );
  }

  return (
    <div className="h-8 md:h-9 lg:h-10 xl:h-11 flex items-center justify-center cursor-pointer">
      <button
        onClick={onClick}
        className="px-1.5 md:px-2 lg:px-3 xl:px-4 py-1.5 md:py-2 flex items-center justify-center text-text-link-light text-button-topheader font-medium text-xs md:text-sm lg:text-base xl:text-button-large leading-4 md:leading-5 lg:leading-6 tracking-[-0.16px] whitespace-nowrap rounded-lg cursor-pointer hover:-translate-y-0.25 transition-transform duration-300"
      >
        {label}
      </button>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [loggingOut, setIsLoggingOut] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Get current active nav item based on route
  const activeNavItem = getActiveNavItem(location.pathname);
  const activeNav = activeNavItem?.id || "";

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavClick = (navId: string) => {
    const navItem = navItems.find((item) => item.id === navId);
    if (navItem) {
      navigate(navItem.path);
      setIsMobileMenuOpen(false); // Close mobile menu on selection
    }
  };

  const handleSearch = () => {
    console.log("Search:", searchValue);
    setIsMobileMenuOpen(false); // Close mobile menu on search
    setIsMobileSearchExpanded(false); // Close mobile search on search
    // Add search logic here
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchExpanded(!isMobileSearchExpanded);
  };

  const handleProfileClick = () => {
    // On desktop, toggle dropdown
    // On mobile, toggle mobile menu
    if (window.innerWidth >= 768) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout API fails, redirect to login
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div className="w-full fixed top-0 left-0 right-0 z-[var(--z-index-header)] h-16 sm:h-20 lg:h-18 m-0 p-0 bg-background-surface-dark">
        {/* Background */}
        {/* <HeaderBg /> */}

        {/* Content Container */}
        <div className="relative w-full h-full flex items-center justify-between z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:pl-[65px] xl:pr-[64px]">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-15">
            {/* Logo */}
            <div
              className="absolute top-0 left-3 sm:left-4 md:left-6 lg:left-8 xl:left-[65px] overflow-visible z-10
              h-[calc(100%+45px)] md:h-[calc(100%+50px)] lg:h-[calc(100%+45px)]"
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-full w-auto object-contain object-top"
              />
            </div>

            {/* Spacer */}
            <div className="flex-shrink-0 w-20 sm:w-24 md:w-28 lg:w-32" />

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center h-11 gap-1 lg:gap-2 xl:gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  label={t(item.translationKey)}
                  isActive={activeNav === item.id}
                  onClick={() => handleNavClick(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Right Section - Search, Divider, Profile on Desktop / Search Icon + Profile on Mobile */}
          <div className="flex items-center relative">
            {/* Desktop: Search, Divider, Profile - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-4">
              {/* Search Bar - Responsive width */}
              {/* <div className="w-32 md:w-40 lg:w-56 xl:w-72 2xl:w-[364px]">
                <SearchBar
                  variant="dark"
                  placeholder={t("ui.searchPlaceholder")}
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={handleSearch}
                />
              </div>
              <div className="hidden lg:block">
                <Divider color="dark" />
              </div> */}
              <LanguageSwitcher />
              {/* <ThemeToggle /> */}
              {/* <div className="hidden lg:block">
                <Divider color="light" />
              </div> */}

              <div className="hidden lg:block">
                <Divider className="bg-[#9C845566]" />
              </div>

              {/* Profile Avatar with Dropdown */}
              <div
                className="relative  flex items-center justify-center"
                ref={profileDropdownRef}
              >
                <button
                  onClick={handleProfileClick}
                  className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-11 xl:h-11 rounded-full overflow-hidden flex-shrink-0 transition-opacity ring-2 ring-primary-500 cursor-pointer"
                >
                  <img
                    src={
                      profileImageError || !user?.image_url
                        ? FallbackImage
                        : user.image_url
                    }
                    alt={user ? `${user.first_name}` : t("ui.imageAlt.profile")}
                    className="w-full h-full object-cover"
                    onError={() => setProfileImageError(true)}
                  />
                </button>

                {/* Desktop Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 bg-primary-200 border border-primary-500 rounded-lg shadow-lg"
                    style={{ zIndex: 1050 }}
                  >
                    <div className="p-4 border-b border-primary-500">
                      <div className="text-text-main font-sans font-medium text-sm">
                        {user?.first_name} {user?.last_name}
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2 py-2 text-text-link-dark hover:bg-primary-600/30 hover:text-primary-600 rounded-md transition-colors text-sm flex items-center gap-2 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="text-text-link-dark w-4 h-4"
                        >
                          <path d="m16 17 5-5-5-5" />
                          <path d="M21 12H9" />
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        </svg>
                        {"Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Search Icon + Profile Avatar */}
            <div
              className="md:hidden flex items-center gap-3 py-4"
              ref={mobileSearchRef}
            >
              {/* Mobile Search - Expandable */}
              {/* {isMobileSearchExpanded ? (
                <div className="flex-1 min-w-0">
                  <SearchBar
                    variant="dark"
                    placeholder={t("ui.searchPlaceholder")}
                    value={searchValue}
                    onChange={setSearchValue}
                    onSearch={handleSearch}
                    className="w-full"
                  />
                </div>
              ) : (
                <button
                  onClick={handleMobileSearchToggle}
                  className="flex items-center justify-center w-8 h-8 text-text-link-light hover:opacity-80 transition-opacity bg-primary-600 rounded-full"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}
              <Divider color="dark" /> */}

              {/* Mobile Profile Avatar */}
              <button
                onClick={handleProfileClick}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-primary-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed top-16 sm:top-20 lg:top-24 left-0 right-0 bg-background-surface-dark border-t border-primary-500 md:hidden shadow-lg"
          style={{ zIndex: 1050 }}
        >
          <div className="flex flex-col py-4 px-4 gap-4 max-h-[80vh] overflow-y-auto">
            {/* Mobile Profile Section */}
            <div className="flex items-center gap-3 py-3 px-2 bg-primary-600/20 rounded-lg">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={
                    profileImageError || !user?.image_url
                      ? FallbackImage
                      : user.image_url
                  }
                  alt={
                    user
                      ? `${user.first_name} ${user.last_name}`
                      : t("ui.imageAlt.profile")
                  }
                  className="w-full h-full object-cover"
                  onError={() => setProfileImageError(true)}
                />
              </div>
              <div className="flex-1">
                <div className="text-text-main text-white font-sans font-medium text-sm">
                  {user
                    ? `${user.first_name} ${user.last_name}`
                    : "Pankaj Aravind Shah"}
                </div>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex justify-center py-2">
              <LanguageSwitcher />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-3 pt-2 border-t border-primary-500">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <div key={item.id} className="w-full flex justify-center">
                    {/* {isActive ? (
                      <TopHeaderButton className="w-full max-w-[180px] h-12 flex items-center justify-center">
                        <button
                          onClick={() => handleNavClick(item.id)}
                          className="text-text-main font-sans font-medium text-sm whitespace-nowrap px-4 w-full text-center"
                        >
                          {t(item.translationKey)}
                        </button>
                      </TopHeaderButton>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className="w-full max-w-xs h-12 px-4 py-3 text-center text-text-link-light font-sans font-medium text-sm transition-all duration-200 hover:bg-primary-600/30 hover:text-primary-200 rounded-lg"
                      >
                        {t(item.translationKey)}
                      </button>
                    )} */}

                    {isActive ? (
                      <TopHeaderButton
                        onClick={() => handleNavClick(item.id)}
                        className="w-full max-w-[180px] h-12 flex items-center justify-center"
                      >
                        <span className="whitespace-nowrap px-4 w-full text-center">
                          {t(item.translationKey)}
                        </span>
                      </TopHeaderButton>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className="w-full max-w-xs h-12 px-4 py-3 text-center text-text-link-light font-sans font-medium text-sm transition-all duration-200 hover:bg-primary-600/30 hover:text-primary-200 rounded-lg"
                      >
                        {t(item.translationKey)}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="pt-3 border-t border-primary-500">
              <button
                onClick={handleLogout}
                className="w-full h-12 px-4 py-3 text-center text-text-link-light font-sans font-medium text-sm transition-all duration-200 hover:bg-red-600/30 hover:text-red-200 rounded-lg border border-primary-500 hover:border-red-500"
              >
                {"Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
