import React from "react";
import { useTranslation } from "react-i18next";
import type { BhaktiGeetItem } from "../../hooks/useBhaktiGeet";

interface BhaktiGeetCardProps {
  song: BhaktiGeetItem;
  onClick: (song: BhaktiGeetItem) => void;
}

export default function BhaktiGeetCard({ song, onClick }: BhaktiGeetCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className="relative w-full cursor-pointer transition-colors hover:bg-primary-100/10"
      onClick={() => onClick(song)}
    >
      {/* Row border top */}
      <div className="bg-border-table h-[1.6px] w-full" />

      {/* Row Content */}
      <div className="flex items-start relative w-full">
        {/* Left border */}
        <div className="bg-border-table self-stretch w-[1.2px] shrink-0" />

        {/* Main content area */}
        <div className="flex-1 flex gap-2 items-start min-h-[72px] px-3 py-3 relative overflow-hidden">
          <div className="flex gap-3 items-start w-full">
            {/* Cover Image — square on mobile */}
            <div className="relative rounded-[10px] shrink-0 w-[60px] h-[60px]">
              <img
                src={song.cover_image || "/song.png"}
                alt={song.name}
                className="absolute inset-0 object-cover rounded-[10px] w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "/song.png";
                }}
              />
            </div>

            {/* Song Details */}
            <div className="flex flex-col gap-1.5 items-start flex-1 min-w-0">
              {/* Song Title */}
              <p
                className="text-song-title w-full"
                style={{
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {song.name}
              </p>

              {/* Album */}
              <p className="text-song-album truncate w-full">
                {song.album || t("bhaktiGeet.traditionalArtist")}
              </p>

              {/* Duration and Date */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center w-full">
                {/* Duration */}
                {/* <div className="flex gap-1.5 items-center">
                <svg className="w-3 h-3 text-text-main shrink-0" />
                <p className="text-song-meta">
                  {song.duration}
                </p>
              </div> */}

                {/* Date */}
                <div className="flex gap-1.5 items-center min-w-0">
                  <svg className="w-3 h-3 text-text-main shrink-0" />
                  <p className="text-song-meta truncate">{song.created_at}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right border */}
        <div className="bg-border-table self-stretch w-[1.2px] shrink-0" />
      </div>
    </div>
  );
}
