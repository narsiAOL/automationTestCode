// Index file for all dummy data exports
export * from "./profileData";
export * from "./bhaktiGeetData";
export * from "./businessInfoData";
export * from "./membersData";

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Helper function to get value or fallback to "-"
export const getValueOrFallback = (
  value: string | undefined | null
): string => {
  return value && value.trim() !== "" ? value : "-";
};
