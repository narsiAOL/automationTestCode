export interface NavItem {
  id: string;
  label: string;
  translationKey: string;
  path: string;
}

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard", // Keep as fallback
    translationKey: "navigation.dashboard",
    path: "/dashboard",
  },
  {
    id: "member",
    label: "Member",
    translationKey: "navigation.member",
    path: "/member",
  },
  {
    id: "business-directory",
    label: "Business Directory",
    translationKey: "navigation.businessDirectory",
    path: "/business-directory",
  },
  {
    id: "bhakti-geet",
    label: "Bhakti Geet",
    translationKey: "navigation.bhaktiGeet",
    path: "/bhakti-geet",
  },
  {
    id: "contact",
    label: "Contact Us",
    translationKey: "navigation.contact",
    path: "/contact",
  },
];

/**
 * Get the active nav item based on the current path
 */
export function getActiveNavItem(currentPath: string): NavItem | undefined {
  // Handle root path as dashboard
  if (currentPath === "/") {
    return navItems.find((item) => item.id === "dashboard");
  }

  return navItems.find((item) => item.path === currentPath);
}

/**
 * Get the nav item by ID
 */
export function getNavItemById(id: string): NavItem | undefined {
  return navItems.find((item) => item.id === id);
}
