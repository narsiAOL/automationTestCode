import { useEffect, useState, useCallback, useRef } from "react";
import peopleService from "../services/people";

export type Person = {
  id: string;
  firstname: string;
  lastname: string;
  surname: string;
  dob: string;
  photo: string;
  kutumb_number: string;
  page_number: string;
};
export type LoadingState =
  | "idle"
  | "initial"
  | "search"
  | "filter"
  | "sort"
  | "pagination";

interface UsePeopleParams {
  // Define any parameters you want to pass to the hook
  search?: string;
  filterBy?: string;
  sort?: string;
  page?: number;
  limit?: number;
  sortBy?: "asc" | "desc";
  deleted_profiles?: boolean;
}

export const usePeople = (params: UsePeopleParams) => {
  // Tracks if we've ever successfully fetched once
  const hasDataRef = useRef(false);
  const {
    search,
    filterBy,
    sort,
    page,
    limit,
    sortBy: sortOrder,
    deleted_profiles,
  } = params;
  const [people, setPeople] = useState<Person[] | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("initial");
  const [error, setError] = useState<string | null>(null);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const fetchPeople = useCallback(async () => {
    // Don't fetch if sort is empty (filters not loaded yet)
    if (!sort) return;

    if (!hasDataRef.current) setLoadingState("initial");
    setError(null);

    try {
      if (search && page === 1) setLoadingState("search");
      if (page && page > 1) setLoadingState("pagination");
      params.sortBy = sortOrder; // Ensure correct param name
      params.deleted_profiles = deleted_profiles; // Include deleted_profiles parameter
      const data = await peopleService.getPeople(params);
      console.log("Fetched people data:", data);

      // Handle case where data or people array might be undefined
      if (!data || !data.people) {
        console.warn("No data or people array returned from API");
        if (page === 1) setPeople([]);
        setHasMorePages(false);
        return;
      }

      // Check if there are more pages based on returned data length
      const receivedCount = data.people.length;
      const hasMore = receivedCount === (limit || 10); // If we got less than requested, no more pages
      setHasMorePages(hasMore);

      // Reset data when it's a new search or sort, otherwise append for pagination
      const isNewQuery = page === 1;
      setPeople((prev) =>
        isNewQuery
          ? data.people
          : prev
            ? [...prev, ...data.people]
            : data.people,
      );
      setTotalCount(Number(data.total_count || 0));

      hasDataRef.current = true;
    } catch (error) {
      setError("Failed to fetch people");
      setHasMorePages(false); // Stop pagination on error
      hasDataRef.current = true;
    } finally {
      setLoadingState("idle");
    }
  }, [search, filterBy, sort, page, limit, sortOrder, deleted_profiles]);

  // Reset pagination state when search or sort changes
  // useEffect(() => {
  //   setHasMorePages(true);
  // }, [search, filterBy, sort, sortOrder]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return {
    people,
    fetchPeople,
    loadingState,
    setLoadingState,
    error,
    hasMorePages,
    totalCount,
  };
};
