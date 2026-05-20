import type { Theme } from "../types/theme";

/**
 * Get the system's preferred color scheme
 */
export const getSystemTheme = (): Theme => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

/**
 * Get the saved theme from localStorage or fallback to system preference
 */
export const getSavedTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme") as Theme;
    return saved || getSystemTheme();
  }
  return "light";
};

/**
 * Apply theme to document
 */
export const applyTheme = (theme: Theme): void => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
};
