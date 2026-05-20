import React, { useState, useEffect, useCallback } from "react";
import peopleService from "../services/people";
import { convertToTreeStructure } from "../utils/familyTreeConverter";

interface FamilyTreeState {
  tree: any;
  rootId: string;
  loading: boolean;
  error: string | null;
}

interface UseFamilyTreeProps {
  personId?: string;
  initialAncestors?: number;
  initialDescendants?: number;
}

export default function useFamilyTree({
  personId = "ab3a3340-09ea-419a-b560-c93d7284e5e0", // Default person ID
  initialAncestors = 0,
  initialDescendants = 1,
}: UseFamilyTreeProps = {}) {
  const [state, setState] = useState<FamilyTreeState>({
    tree: {},
    rootId: personId,
    loading: true,
    error: null,
  });

  const [ancestorsLevel, setAncestorsLevel] = useState(initialAncestors);
  const [descendantsLevel, setDescendantsLevel] = useState(initialDescendants);

  const fetchFamilyTree = useCallback(
    async (ancestorsLvl: number, descendantsLvl: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Fetch both ancestors and descendants data
        const [ancestorsData, descendantsData] = await Promise.all([
          ancestorsLvl > 0
            ? peopleService.getAncestors(personId, ancestorsLvl)
            : Promise.resolve(null),
          descendantsLvl > 0
            ? peopleService.getDescendants(personId, descendantsLvl)
            : Promise.resolve(null),
        ]);

        // Convert API response to tree structure
        const { tree, rootId } = convertToTreeStructure(
          ancestorsData,
          descendantsData,
          personId,
        );

        setState({
          tree,
          rootId,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching family tree:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load family tree data",
        }));
      }
    },
    [personId],
  );

  // Update ancestors level and refetch data
  const updateAncestors = useCallback(
    (level: number) => {
      setAncestorsLevel(level);
      fetchFamilyTree(level, descendantsLevel);
    },
    [fetchFamilyTree, descendantsLevel],
  );

  // Update descendants level and refetch data
  const updateDescendants = useCallback(
    (level: number) => {
      setDescendantsLevel(level);
      fetchFamilyTree(ancestorsLevel, level);
    },
    [fetchFamilyTree, ancestorsLevel],
  );

  // Fetch on mount and reset levels whenever personId changes
  useEffect(() => {
    setAncestorsLevel(initialAncestors);
    setDescendantsLevel(initialDescendants);
    fetchFamilyTree(initialAncestors, initialDescendants);
  }, [personId, initialAncestors, initialDescendants, fetchFamilyTree]);

  return {
    tree: state.tree,
    rootId: state.rootId,
    loading: state.loading,
    error: state.error,
    ancestorsLevel,
    descendantsLevel,
    updateAncestors,
    updateDescendants,
    refetch: () => fetchFamilyTree(ancestorsLevel, descendantsLevel),
  };
}
