/**
 * Formats a date string or Date object to dd/mm/yyyy format
 * @param date - Date string, Date object, or null/undefined
 * @returns Formatted date string in dd/mm/yyyy format, or empty string if invalid
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) {
    return "";
  }

  try {
    let dateObj: Date;

    if (typeof date === "string") {
      // Handle various date string formats
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "";
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns 0-11
    const year = dateObj.getFullYear().toString();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "";
  }
}

/**
 * Formats a date with fallback value using the getValueOrFallback pattern
 * @param date - Date string, Date object, or null/undefined
 * @param fallback - Fallback value (default: 'N/A')
 * @returns Formatted date string or fallback value
 */
export function formatDateWithFallback(
  date: string | Date | null | undefined,
  fallback: string = "N/A"
): string {
  const formatted = formatDate(date);
  return formatted || fallback;
}
