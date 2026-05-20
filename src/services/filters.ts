import { API_ENDPOINTS } from "./apiEndpoints";
import httpClient from "./http";
import type { SortKey } from "../components/ui/FunctionalButton";
type FilterType = "people" | "business_directory" | "bhakti_geet" | "";
interface FilterValue {
  sort: string;
  sortBy: "asc" | "desc";
  label: string;
}

interface FilterResponse {
  commonFilter: Array<{
    title: string;
    filterValues: FilterValue[];
  }>;
}

class FiltersService {
  async getFilters(filterType?: FilterType) {
    try {
      const params = filterType ? { filterType } : {};
      const response = await httpClient.get(API_ENDPOINTS.filters, { params });
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Utility function to extract sort keys from filter response
  extractSortKeys(filterData: FilterResponse): SortKey[] {
    if (!filterData?.commonFilter || filterData.commonFilter.length === 0) {
      return [];
    }

    const sortByFilter = filterData.commonFilter.find(
      (filter) => filter.title === "Sort by"
    );

    if (!sortByFilter?.filterValues) {
      return [];
    }

    // Group by sort field and create unique sort keys
    const sortKeysMap = new Map<string, string>();

    sortByFilter.filterValues.forEach((filterValue) => {
      if (!sortKeysMap.has(filterValue.sort)) {
        // Extract a clean label without ASC/DESC suffix
        const baseLabel = filterValue.label
          .replace(/\s+(ASC|DESC)$/i, "")
          .trim();
        sortKeysMap.set(filterValue.sort, baseLabel);
      }
    });

    // Convert map to SortKey array
    return Array.from(sortKeysMap.entries()).map(([value, label]) => ({
      label,
      value,
    }));
  }
}
export const filtersService = new FiltersService();
