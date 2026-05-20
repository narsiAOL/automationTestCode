import { useState, useEffect } from "react";
import dashBoardService from "../services/dashboard";

export const useGetFamilies = () => {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFamilies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashBoardService.getFamilies();
      setFamilies(response.families || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  return { families, loading, error, fetchFamilies };
};
