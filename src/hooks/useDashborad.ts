import { useCallback, useEffect, useState } from "react";
import DashBoardService from "../services/dashboard";
import dashBoardService from "../services/dashboard";
import { t } from "i18next";
type DashboardInfo = {
  totalMembers: string;
  familyGroups: number;
  countryCount: string;
  coupleCount: string;
};

export const useDashboard = () => {
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashBoardService.getDashboardInfo();
      console.log("Fetched dashboard info:", data.dashboardInfo);
      setDashboardInfo(data.dashboardInfo);
    } catch (error) {
      setError(t("Failed to fetch dashboard info"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardInfo();
  }, [fetchDashboardInfo]);

  return { dashboardInfo, loading, error };
};
