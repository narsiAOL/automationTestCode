import { useEffect, useState, useCallback, useRef } from "react";
import peopleService from "../services/people";

export interface BusinessDirectoryItem {
  id: string;
  full_name: string;
  dob: string;
  photo: string;
  kutumb_number: string;
  page_number: string;
  business_name: string;
  business_category: string;
  full_address: string;
  business_email: string;
  business_phone: string;
  business_whatsapp: string;
  business_website: string;
  business_instagram: string;
  business_facebook:string;
}

export type LoadingState =
  | "idle"
  | "initial"
  | "search"
  | "filter"
  | "sort"
  | "pagination";

interface UseBusinessDirectoryParams {
  search?: string;
  filterBy?: string;
  sort?: string;
  page?: number;
  limit?: number;
  sortBy?: "asc" | "desc";
}

export const useBusinessDirectory = (params: UseBusinessDirectoryParams) => {
  const hasDataRef = useRef(false);
  const { search, filterBy, sort, page, limit, sortBy } = params;
  const [businessDirectory, setBusinessDirectory] = useState<
    BusinessDirectoryItem[] | null
  >(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("initial");
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessDirectory = useCallback(async () => {
    // Don't fetch if sort is empty (filters not loaded yet)
    if (!sort) return;

    if (!hasDataRef.current) setLoadingState("initial");
    setError(null);

    try {
      if (search) setLoadingState("search");
      if (page && page > 1) setLoadingState("pagination");

      const data = await peopleService.getBusinessDirectory(params);

      setBusinessDirectory((prev) =>
        page && page > 1 && prev
          ? [...prev, ...data.businessDirectory]
          : data.businessDirectory
      );

      hasDataRef.current = true;
    } catch (error) {
      setError("Failed to fetch business directory");
      hasDataRef.current = true;
    } finally {
      setLoadingState("idle");
    }
  }, [search, filterBy, sort, page, limit, sortBy]);

  useEffect(() => {
    fetchBusinessDirectory();
  }, [fetchBusinessDirectory]);

  return {
    businessDirectory,
    fetchBusinessDirectory,
    loadingState,
    setLoadingState,
    error,
  };
};
