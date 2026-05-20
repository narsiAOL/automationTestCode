import { useEffect } from "react";
import Button from "./Button";

interface ConfirmationModalProps {
  title?: string;
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  title = "Are you sure?",
  isOpen,
  message,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-modal-title"
          aria-describedby="confirmation-modal-description"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4">
            <h2
              id="confirmation-modal-title"
              className="text-lg font-semibold text-[#1C1811]"
            >
              {title}
            </h2>
          </div>

          <p
            id="confirmation-modal-description"
            className="mb-6 text-sm leading-6 text-[#3B2A14]"
          >
            {message}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DAD1BC] bg-white px-4 py-2 text-sm font-medium text-[#3D2B1F] transition hover:bg-[#F8F4EE] cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button>
            <Button
              variant="primary"
              onClick={onConfirm}
              className="w-full sm:w-auto"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
