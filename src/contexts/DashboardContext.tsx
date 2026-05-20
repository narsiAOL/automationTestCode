// context/DashboardContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Person } from "../hooks/usePeople";
import type { DashboardTab } from "../components/DashboardHeader";

interface DashboardContextType {
  selectedPersonId: string | null;
  setSelectedPersonId: (p: string | null) => void;
  activeTab: DashboardTab;
  setActiveTab: (t: DashboardTab) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");

  return (
    <DashboardContext.Provider
      value={{ selectedPersonId, setSelectedPersonId, activeTab, setActiveTab }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardState = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboardState must be inside DashboardProvider");
  return ctx;
};
