import { useEffect, useState, useCallback, useRef } from "react";
import musicService from "../services/music";

export interface BhaktiGeetItem {
  id: string;
  name: string;
  created_at: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  music_path: string | null;
  cover_image: string | null;
}

export type LoadingState =
  | "idle"
  | "initial"
  | "search"
  | "filter"
  | "sort"
  | "pagination";

interface UseBhaktiGeetParams {
  search?: string;
  filterBy?: string;
  sort?: string;
  page?: number;
  limit?: number;
  sortBy?: "asc" | "desc";
}
const formatDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
export const useBhaktiGeet = (params: UseBhaktiGeetParams = {}) => {
  const hasDataRef = useRef(false);
  const { search, filterBy, sort, page, limit, sortBy } = params;
  const [musicLibrary, setMusicLibrary] = useState<BhaktiGeetItem[] | null>(
    null
  );
  const [loadingState, setLoadingState] = useState<LoadingState>("initial");
  const [error, setError] = useState<string | null>(null);

  const fetchBhaktiGeet = useCallback(async () => {
    // Don't fetch if sort is empty (filters not loaded yet)
    // if (!sort) return;

    if (!hasDataRef.current) setLoadingState("initial");
    setError(null);
    try {
      if (search) setLoadingState("search");
      if (page && page > 1) setLoadingState("pagination");

      const data = await musicService.getAllMusic(params);
      const formatted = (data?.musicLibrary || []).map(
        (item: BhaktiGeetItem) => ({
          ...item,
          created_at: formatDate(item.created_at),
        })
      );

      setMusicLibrary((prev) =>
        page && page > 1 && prev ? [...prev, ...formatted] : formatted
      );
      hasDataRef.current = true;
    } catch (error) {
      setError("Failed to fetch music library");
      hasDataRef.current = true;
    } finally {
      setLoadingState("idle");
    }
  }, [search, filterBy, sort, page, limit, sortBy]);

  useEffect(() => {
    fetchBhaktiGeet();
  }, [fetchBhaktiGeet]);

  return {
    musicLibrary,
    fetchBhaktiGeet,
    loadingState,
    setLoadingState,
    error,
  };
};
