import { useEffect, useRef, useState } from "react";
import { useImageWithFallback } from "../../hooks/useImageWithFallback";
import type { BhaktiGeetItem } from "../../hooks/useBhaktiGeet";
import DeleteIcon from "./DeleteIcon";

interface MusicCardProps {
  songData: any;
  className?: string;
  onDeleteClick?: () => void;
  onPlayClick?: () => void;
}

export default function MusicCard({
  songData,
  className = "",
  onDeleteClick,
  onPlayClick,
}: MusicCardProps) {
  console.log("Rendering MusicCard for song:", songData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cover = songData.cover_image || songData.cover || "/song.png";
  const title = songData.name || songData.title || "Song Title";
  const subtitle = songData.artist || songData.album || "Artist Name";
  const { imageUrl } = useImageWithFallback(cover, {
    fallbackUrl: "/song.png",
    timeoutMs: 5000,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative w-full rounded-lg border border-primary-500 bg-[#ffffff] shadow-sm transition hover:shadow-md ${className}`}
      aria-label={title}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex-shrink-0">
          <div className="h-14 w-14 rounded-[18px] border border-primary-500 p-1 flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full rounded-[14px] object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/song.png";
              }}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#3D2B1F] truncate">
            {title}
          </p>
          <p className="text-xs text-[#6B6056] truncate">{subtitle}</p>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--button-brown)] text-white transition hover:bg-[var(--button-brown-hover)]"
            onClick={(e) => {
              e.stopPropagation();
              onPlayClick?.();
            }}
            aria-label="Play song"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <button
            type="button"
            className="flex h-9 w-4 items-center justify-center  text-[#3D2B1F]"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            aria-label="More options"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 z-20 w-40 rounded-2xl border border-[#DAD1BC] bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="w-full px-4 py-3 text-left text-sm text-[#3D2B1F] hover:bg-[#FBF7F3]"
                onClick={() => {
                  setIsMenuOpen(false);
                  onPlayClick?.();
                }}
              >
                Play
              </button>
              {onDeleteClick && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
