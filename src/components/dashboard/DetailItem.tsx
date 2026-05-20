import React, { useState, useRef, useEffect } from "react";
import EditIcon from "../ui/icons/EditIcon";
import { useAuth } from "../../contexts";

interface DetailItemProps {
  label: string;
  value: string;
  id: string;
  isRightColumn?: boolean;
  isEdit?: boolean;
  onEditClick?: (id: string) => void;
}

export default function DetailItem({
  label,
  value,
  id = "",
  isEdit = false,
  isRightColumn = false,
  onEditClick,
}: DetailItemProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "1";
  // Combine all conditions for showing the edit button
  const canEdit =
    isEdit &&
    value !== "-" &&
    id !== "-" &&
    onEditClick &&
    id !== "" &&
    isAdmin;
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isEdit && id !== "-" && value && value !== "-") {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleOpenInNewTab = (id: string) => {
    if (value && value !== "-" && id !== "-") {
      const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || "";
      const url = `${baseUrl}/member-profile/${id}`;
      window.open(url, "_blank");
    }
    setMenu(null);
  };

  // Close menu on click elsewhere
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menu]);

  return (
    <div className="flex items-start gap-1 xl:gap-3 group">
      <div
        className={`text-detail-item text-text-labels flex-shrink-0 
            ${
              isRightColumn
                ? "w-32 md:w-28 xl:w-36"
                : "w-32 md:w-32 lg:w-26 xl:w-33"
            }
        `}
      >
        {label}
      </div>
      <div className="text-detail-item text-text-labels opacity-70">:</div>
      <div className="text-detail-item text-text-main flex-1 pl-2">
        {label === "Latest Residential Address" ? (
          <div className="whitespace-pre-line">{value}</div>
        ) : (
          <div className="relative inline-flex items-center">
            <span
              ref={valueRef}
              onContextMenu={
                isEdit && id && id !== "-" && value && value !== "-"
                  ? handleContextMenu
                  : undefined
              }
              style={{
                cursor:
                  isEdit && id && id !== "-" && value && value !== "-"
                    ? "context-menu"
                    : "default",
              }}
              title={
                isEdit && id && id !== "-" && value && value !== "-"
                  ? "Right click for options"
                  : undefined
              }
            >
              {value}
            </span>
            {menu && isEdit && id && id !== "-" && value && value !== "-" && (
              <div
                style={{
                  position: "fixed",
                  top: menu.y + 4,
                  left: menu.x + 2,
                  zIndex: 1000,
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  padding: "2px 0",
                  minWidth: 150,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                  onClick={() => handleOpenInNewTab(id)}
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  Open in new tab
                </button>
              </div>
            )}
            {canEdit && (
              <button
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                tabIndex={-1}
                aria-label="Edit"
                onClick={() => onEditClick && onEditClick(id)}
              >
                <EditIcon />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
