import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import FlowIcon from "../../assets/svgs/flow-icon.svg";
import OrnamentalDivider from "./OrnamentalDivider";
import Loader from "./Loader";
import FallbackImage from "../../assets/svgs/fallback-image.svg";
import DeleteIcon from "./DeleteIcon";
import { useTranslation } from "react-i18next";
import { useImageWithFallback } from "../../hooks/useImageWithFallback";
import { useAuth } from "../../contexts";
import { isAdmin } from "../../utils/userUtils";

interface ProfileFrameProps {
  src?: string;
  name?: string;
  kutumb_no?: string;
  page_no?: string;
  className?: string;
  onViewProfile?: () => void;
  onFamilyChart?: () => void;
  onDeleteClick?: () => void;
}

export default function ProfileFrame({
  src = "",
  name = "Name",
  kutumb_no = "0000",
  page_no = "00",
  className = "",
  onViewProfile,
  onFamilyChart,
  onDeleteClick,
}: ProfileFrameProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isAdminUser = isAdmin(user);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { t } = useTranslation();

  const { imageUrl: safeImageUrl, isLoading } = useImageWithFallback(src, {
    fallbackUrl: FallbackImage,
    timeoutMs: 5000,
  });

  return (
    <div
      ref={wrapperRef}
      className={`relative group flex flex-col overflow-hidden ${className}`}
      style={{
        width: "100%",
        background: "#fbf7f3",
        border: "1px solid #DAD1BC",
        borderRadius: 8,
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 16,
        paddingLeft: 8,
        gap: 12,
      }}
      data-name="Profile Frame"
    >
      {/* ── Photo ─────────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ borderRadius: 6, aspectRatio: "276 / 220" }}
      >
        {onDeleteClick && isAdminUser && (
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              type="button"
              className="hidden sm:flex items-center justify-center h-9 w-9 text-[#3D2B1F] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick();
              }}
              aria-label="Delete profile"
            >
              <DeleteIcon />
            </button>

            <div className="sm:hidden relative">
              <button
                type="button"
                className="flex h-9 w-9 mt-[-12px] mr-[-12px] items-center justify-center  text-[#3D2B1F]"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen((prev) => !prev);
                }}
                aria-label="More options"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
              {isMenuOpen && (
                <div
                  className="absolute right-0 top-full z-20 w-24 rounded-md border border-[#DAD1BC] bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left text-sm text-[#3D2B1F] hover:bg-[#FBF7F3]"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeleteClick();
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-[#EDE7DA]">
            <Loader
              spinnerClassName="w-6 h-6 border-2"
              containerClassName="bg-transparent"
            />
          </div>
        ) : (
          <img
            src={safeImageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>

      {/* Info  */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        {/* Badges row */}
        <div className="flex items-center" style={{ gap: 8 }}>
          {/* Kutumb badge — light cream */}
          {kutumb_no ? (
            <span
              className="text-profile-info sm:text-xs"
              style={{
                color: "#3D2B1F",
                background: "#EDE7DA",
                border: "1px solid #DAD1BC",
                borderRadius: 4,
                padding: "4px 8px",
                lineHeight: "20px",
                minWidth: 57,
                textAlign: "center",
              }}
            >
              {kutumb_no}
            </span>
          ) : (
            // Skeleton placeholder — same height, no text
            <span
              style={{
                display: "inline-block",
                background: "#DAD1BC",
                borderRadius: 4,
                width: 57,
                height: 28,
                opacity: 0.5,
              }}
            />
          )}
          {/* Page badge — dark brown */}
          {/* {page_no ? (
            <span
              className="text-profile-info text-xs sm:text-sm"
              style={{
                color: "#FFFFFF",
                background: "#3D2B1F",
                border: "1px solid #1C1811",
                borderRadius: 4,
                padding: "4px 8px",
                lineHeight: "20px",
                minWidth: 37,
                textAlign: "center",
              }}
            >
              {page_no}
            </span>
          ) : (
            // Skeleton placeholder — same height, no text
            <span
              style={{
                display: "inline-block",
                background: "#3D2B1F",
                borderRadius: 4,
                width: 37,
                height: 28,
                opacity: 0.3,
              }}
            />
          )} */}
        </div>

        {/* Name */}
        <div className="text-profile-name capitalize truncate text-sm sm:text-xs">
          {name}
        </div>

        {/* Ornamental divider */}
        <OrnamentalDivider />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            className="flex-1 h-9 text-view-profile-button sm:text-xs"
            onClick={onViewProfile}
          >
            {t("ui.buttonText.viewProfile")}
          </Button>
          <Button
            variant="outlined"
            onClick={onFamilyChart}
            className="!w-9 !h-9 !p-0 flex-shrink-0"
          >
            <img src={FlowIcon} alt="Family Chart" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
