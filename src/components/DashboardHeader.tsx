import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Button, Tab, SectionTitle } from "./ui";
import DashboardHeaderButton from "./ui/DashboardHeaderButton";
import DownloadButton from "./ui/DownloadButton";
import Divider from "./ui/Divider";
import DownArrow from "./ui/DownArrow";
import Loader from "./ui/Loader";
import { useProfile } from "../hooks/useProfile";
import { useDashboardState } from "../contexts/DashboardContext";
import { useAuth } from "../contexts";
import { isAdmin } from "../utils/userUtils";

export type DashboardTab =
  | "profile"
  | "businessCard"
  | "chart"
  | "bhaktiGeet"
  | "more";

interface DashboardHeaderProps {
  activeTab: DashboardTab;
  profile: ReturnType<typeof useProfile>["profile"];
  onTabChange: (tab: DashboardTab) => void;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export default function DashboardHeader({
  activeTab,
  profile,
  onTabChange,
  onDownload,
  isDownloading = false,
}: DashboardHeaderProps) {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isAdminUser = isAdmin(user);

  const tabs: { key: DashboardTab; label: string; hasDropdown?: boolean }[] = [
    { key: "profile", label: t("dashboard.tabs.profile") },
    { key: "businessCard", label: t("dashboard.tabs.businessCard") },
    { key: "chart", label: t("dashboard.tabs.chart") },
    { key: "bhaktiGeet", label: t("dashboard.tabs.bhaktiGeet") },
    // { key: "more", label: t("dashboard.tabs.more"), hasDropdown: true },
  ];

  const activeTabLabel = tabs.find((tab) => tab.key === activeTab)?.label ?? "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-9 md:gap-6 lg:gap-9">
      {/* Title Section with Ornamental Elements */}
      <SectionTitle
        title={`${profile?.personal_details.firstname || ""} ${(profile?.personal_details.lastname !== "-" && profile?.personal_details.lastname) || ""} ${profile?.personal_details.surname || ""}`}
      />

      {/* Mobile Tabs Section - Only visible on mobile screens */}
      <div className="flex md:hidden w-full px-4 mb-6">
        <div ref={dropdownRef} className="flex items-center gap-2 w-full">
          {/* Tab Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-md bg-[#3D2B1F] text-[#F5F0E6] cursor-pointer"
            >
              <span className="truncate">{activeTabLabel}</span>
              <DownArrow
                className="w-5 h-5 flex-shrink-0 ml-2"
                color="var(--primary-100)"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#A371034D] rounded-md shadow-lg z-50 overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      onTabChange(tab.key);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 transition-colors duration-200 ${
                      activeTab === tab.key
                        ? "bg-[#FFF4E6] text-[#3D2B1F] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download Button */}
          {isAdminUser && (
            <DownloadButton
              onClick={onDownload}
              className="flex-shrink-0 flex items-center justify-center cursor-pointer"
            >
              {isDownloading ? (
                <Loader
                  spinnerClassName="!w-2 !h-2 border-2"
                  containerClassName="w-4 h-4"
                />
              ) : (
                <span className="truncate" title={t("dashboard.tabs.download")}>
                  {t("dashboard.tabs.download")}
                </span>
              )}
            </DownloadButton>
          )}
        </div>
      </div>

      {/* Desktop Tabs Section - Hidden on mobile screens */}
      <div className="hidden md:flex flex-col items-center justify-center w-full py-0">
        <div className="flex items-center justify-center gap-2.5 md:gap-1.5 lg:gap-2.5 flex-wrap md:flex-nowrap">
          {tabs.map((tab, index) => (
            <div
              key={tab.key}
              className="flex items-center justify-center gap-2.5 md:gap-1.5 lg:gap-2.5 flex-shrink-0"
            >
              <div className="flex items-center gap-1">
                <DashboardHeaderButton
                  isActive={activeTab === tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`${
                    tab.key === "more"
                      ? "px-3 md:px-2.5 lg:px-3"
                      : "md:px-4 lg:px-5"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span
                      className="text-truncate-tab-flexible"
                      title={tab.label}
                    >
                      {tab.label}
                    </span>
                    {tab.hasDropdown && (
                      <DownArrow
                        className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0"
                        color={
                          activeTab === tab.key
                            ? "var(--primary-100)"
                            : "var(--text-main)"
                        }
                      />
                    )}
                  </span>
                </DashboardHeaderButton>
              </div>

              {/* Divider between tabs (except after last tab) */}
              {index < tabs.length - 1 && (
                <div className="flex items-center justify-center w-0.5 h-7">
                  <div className="">
                    <Divider color="light" size="small" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Final divider before download button */}
          {isAdminUser && (
            <div className="flex items-center justify-center w-0.5 h-7">
              <div className="">
                <Divider color="light" size="small" />
              </div>
            </div>
          )}

          {/* Download Button */}
          {/* <div className="w-32 md:w-28 lg:w-32 xl:w-36">
            <Button variant="secondary" onClick={onDownload} className="w-full">
              {isDownloading ? (
                <Loader spinnerClassName="w-4 h-4 border-2" />
              ) : (
                <span className="truncate" title={t("dashboard.tabs.download")}>
                  {t("dashboard.tabs.download")}
                </span>
              )}
            </Button>
          </div> */}

          {/* <div className="w-32 md:w-28 lg:w-32 xl:w-36"> */}
          {isAdminUser && (
            <div className="flex items-center gap-1">
              <DownloadButton
                onClick={onDownload}
                className="w-full flex items-center justify-center cursor-pointer"
              >
                {isDownloading ? (
                  <Loader spinnerClassName="w-4 h-4 border-2" />
                ) : (
                  <span
                    className="truncate"
                    title={t("dashboard.tabs.download")}
                  >
                    {t("dashboard.tabs.download")}
                  </span>
                )}
              </DownloadButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
