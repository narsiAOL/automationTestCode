import React, { useEffect } from "react";
import CloseIcon from "../../assets/icons/CloseIcon";
import MainBg from "./MainBg";
import HorizontalDivider from "./HorizontalDivider";

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function EditDrawer({
  isOpen,
  onClose,
  title,
  children,
}: EditDrawerProps) {
  // Lock scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="drawer-container" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="drawer-header z-1">
          <h2 className="text-heading-6 text-primary-600">{title}</h2>
          <button
            onClick={onClose}
            className="drawer-close-btn"
            aria-label="Close drawer"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* Content */}
        <div className="drawer-content custom-scrollbar z-1">{children}</div>
      </div>
    </>
  );
}
