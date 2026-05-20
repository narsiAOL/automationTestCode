// Types for API responses
import fallbackImage from "../assets/svgs/fallback-image.svg";

interface Spouse {
  person_id: string;
  full_name: string;
  dob: string | null;
  gender: "m" | "f";
  photo?: string | null;
  marriage_date?: string | null;
  children?: SpouseChild[]; // children specific to this couple
}

interface SpouseChild {
  person_id: string;
  full_name: string;
  dob: string | null;
  gender: "m" | "f";
  photo?: string | null;
  spouses?: Spouse[];
  children?: SpouseChild[];
  unassigned_children?: SpouseChild[];
}

interface Person {
  person_id: string;
  full_name: string;
  dob: string | null;
  gender: "m" | "f";
  photo?: string | null;
  children: Person[]; // legacy (may be empty now)
  spouse?: Person; // legacy single spouse
  spouses?: Spouse[]; // new per-spouse structure
  unassigned_children?: SpouseChild[]; // children with no specific spouse
  attached_family_id?: string | null;
  attached_family_data?: {
    family_name?: string;
    id?: string;
    [key: string]: any;
  } | null;
}

interface AncestorsResponse {
  ancestors: Person & {
    level: number;
    father?: Person;
    mother?: Person;
    children: Person[];
  };
}

interface DescendantsResponse {
  descendants: Person & {
    level: number;
    spouse?: Person;
    spouses?: Spouse[];
    children: Person[];
    unassigned_children?: SpouseChild[];
  };
}

// Types for tree structure
interface TreeNode {
  id: string;
  name: string;
  type?: string;
  image?: string;
  description?: string;
  children?: string[];
  spouses?: string[];
  parents?: string[];
  isSpouse?: boolean;
  isAttachedFamily?: boolean;
  familyId?: string;
}

interface TreeStructure {
  [key: string]: TreeNode;
}

/**
 * Adds a simple (non-recursive) child node to the tree.
 */
function addChildNode(
  child: SpouseChild,
  tree: TreeStructure,
  parentIds: string[],
): void {
  const childId = child.person_id;

  // Collect this child's own spouses from the API data
  const childSpouseIds = (child.spouses || []).map((s) => s.person_id);

  // All children this child has across all their couples
  const grandchildIds = [
    ...(child.children || []).map((c) => c.person_id),
    ...(child.unassigned_children || []).map((c) => c.person_id),
    ...(child.spouses || []).flatMap((s) =>
      (s.children || []).map((c) => c.person_id),
    ),
  ];

  if (!tree[childId]) {
    tree[childId] = {
      id: childId,
      name: child.full_name,
      image: child.photo,
      children: grandchildIds,
      spouses: childSpouseIds,
      parents: parentIds.length > 0 ? [...parentIds] : undefined,
    };
  } else {
    if (parentIds.length > 0) tree[childId].parents = [...parentIds];
  }

  // Wire child's parents to include this child
  parentIds.forEach((pid) => {
    if (tree[pid] && !tree[pid].children?.includes(childId)) {
      tree[pid].children = [...(tree[pid].children || []), childId];
    }
  });

  // Recurse into this child's own couples
  if (child.spouses && child.spouses.length > 0) {
    processPersonAndDescendants(child as any, tree, parentIds);
  } else if (
    (child.children || []).length > 0 ||
    (child.unassigned_children || []).length > 0 ||
    ((child as any).attached_family_id && (child as any).attached_family_data)
  ) {
    processPersonAndDescendants(child as any, tree, parentIds);
  }
}

/**
 * Recursively processes a person and all their descendants
 * @param person - The person to process
 * @param tree - The tree structure being built
 * @param parentIds - Array of parent IDs for this person
 */
function processPersonAndDescendants(
  person: Person,
  tree: TreeStructure,
  parentIds: string[] = [],
): void {
  // Normalise spouses: support both legacy `spouse` and new `spouses` array
  const allSpouses: Spouse[] = [
    ...(person.spouses || []),
    ...(person.spouse &&
    !person.spouses?.find((s) => s.person_id === person.spouse!.person_id)
      ? [
          {
            person_id: person.spouse.person_id,
            full_name: person.spouse.full_name,
            dob: person.spouse.dob,
            gender: person.spouse.gender,
            photo: person.spouse.photo ?? null,
            children: person.children?.map((c) => c as any) || [],
          },
        ]
      : []),
  ];

  // Build full children list:
  // - Multi-spouse: main person only lists unassigned + legacy children (NOT couple-specific)
  //   so that couple-specific children belong structurally to the spouse node only.
  // - Single spouse: include all children as before.
  const perSpouseChildIds = allSpouses.flatMap((s) =>
    (s.children || []).map((c) => c.person_id),
  );
  const unassignedChildIds = (person.unassigned_children || []).map(
    (c) => c.person_id,
  );
  const legacyChildIds = (person.children || []).map((c) => c.person_id);

  const isMultiSpouse = allSpouses.length >= 2;
  const allChildIds = isMultiSpouse
    ? [...new Set([...unassignedChildIds, ...legacyChildIds])]
    : [
        ...new Set([
          ...perSpouseChildIds,
          ...unassignedChildIds,
          ...legacyChildIds,
        ]),
      ];

  // Register/update the main person
  if (!tree[person.person_id]) {
    tree[person.person_id] = {
      id: person.person_id,
      name: person.full_name,
      image: person.photo,
      children: allChildIds,
      spouses: allSpouses.map((s) => s.person_id),
      parents: parentIds.length > 0 ? [...parentIds] : undefined,
    };
  } else {
    tree[person.person_id].children = allChildIds;
    tree[person.person_id].spouses = allSpouses.map((s) => s.person_id);
    if (parentIds.length > 0) tree[person.person_id].parents = [...parentIds];
  }

  // Register each spouse and wire their couple-specific children
  allSpouses.forEach((spouse) => {
    const spouseChildIds = (spouse.children || []).map((c) => c.person_id);

    if (!tree[spouse.person_id]) {
      tree[spouse.person_id] = {
        id: spouse.person_id,
        name: spouse.full_name,
        image: spouse.photo,
        isSpouse: true,
        children: spouseChildIds,
        spouses: [person.person_id],
      };
    } else {
      // Merge children without duplicates
      const existing = new Set(tree[spouse.person_id].children || []);
      spouseChildIds.forEach((id) => existing.add(id));
      tree[spouse.person_id].children = [...existing];
    }

    // Recursively process children of this couple
    const coupleParentIds = [person.person_id, spouse.person_id];
    (spouse.children || []).forEach((child) => {
      addChildNode(child, tree, coupleParentIds);
    });
  });

  // Process unassigned children (only the main person as parent)
  (person.unassigned_children || []).forEach((child) => {
    addChildNode(child, tree, [person.person_id]);
  });

  // Process legacy children (main person + first spouse as parents, if any)
  if ((person.children || []).length > 0) {
    const legacyParentIds = [
      person.person_id,
      ...(allSpouses.length > 0 ? [allSpouses[0].person_id] : []),
    ];
    person.children.forEach((child) => {
      processPersonAndDescendants(child, tree, legacyParentIds);
    });
  }

  // Create a virtual child node for the attached family if present
  if (person.attached_family_id && person.attached_family_data) {
    const familyNodeId = `family_${person.attached_family_id}`;
    const familyLabel =
      person.attached_family_data.description ||
      person.attached_family_data.family_name ||
      "Attached Family";
    if (!tree[familyNodeId]) {
      tree[familyNodeId] = {
        id: familyNodeId,
        name: familyLabel,
        description: person.attached_family_data.description,
        isAttachedFamily: true,
        familyId: person.attached_family_id,
        children: [],
        spouses: [],
        parents: [person.person_id],
      };
    }
    if (!tree[person.person_id].children?.includes(familyNodeId)) {
      tree[person.person_id].children = [
        ...(tree[person.person_id].children || []),
        familyNodeId,
      ];
    }
  }
}

/**
 * Recursively processes ancestors (father's lineage only) and adds them to the tree
 * @param person - The ancestor to process
 * @param tree - The tree structure being built
 * @param childId - ID of the child this ancestor belongs to
 * @param isDirectFatherLineage - Whether this is part of the direct father lineage
 * @returns The topmost ancestor ID in the father lineage
 */
function processAncestorsRecursively(
  person: any,
  tree: TreeStructure,
  childId: string,
  isDirectFatherLineage: boolean = false,
): string {
  // Add the ancestor to the tree
  if (!tree[person.person_id]) {
    tree[person.person_id] = {
      id: person.person_id,
      name: person.full_name,
      image: person.photo,
      children: [childId],
      spouses: [],
      parents: [],
    };
  } else {
    // Update existing person - add child if not already present
    if (!tree[person.person_id].children?.includes(childId)) {
      tree[person.person_id].children = [
        ...(tree[person.person_id].children || []),
        childId,
      ];
    }
  }

  // Mark fathers in direct lineage with type "input"
  if (isDirectFatherLineage) {
    tree[person.person_id].type = "input";
  }

  let topmostAncestorId = person.person_id;

  // Process father recursively (continue the patrilineal line)
  if (person.father) {
    const fatherTopmostId = processAncestorsRecursively(
      person.father,
      tree,
      person.person_id,
      isDirectFatherLineage,
    );

    // Update current person's parents to include father
    if (!tree[person.person_id].parents?.includes(person.father.person_id)) {
      tree[person.person_id].parents = [
        ...(tree[person.person_id].parents || []),
        person.father.person_id,
      ];
    }

    // The topmost ancestor is from the father's line
    topmostAncestorId = fatherTopmostId;
  }

  // Process mother (but don't continue her lineage recursively)
  if (person.mother) {
    if (!tree[person.mother.person_id]) {
      tree[person.mother.person_id] = {
        id: person.mother.person_id,
        name: person.mother.full_name,
        image: person.mother.photo,
        children: [person.person_id],
        isSpouse: true,
        spouses: person.father ? [person.father.person_id] : [],
      };
    }

    // Add mother as parent
    if (!tree[person.person_id].parents?.includes(person.mother.person_id)) {
      tree[person.person_id].parents = [
        ...(tree[person.person_id].parents || []),
        person.mother.person_id,
      ];
    }

    // Add mother as spouse to father if father exists
    if (person.father && tree[person.father.person_id]) {
      if (
        !tree[person.father.person_id].spouses?.includes(
          person.mother.person_id,
        )
      ) {
        tree[person.father.person_id].spouses = [
          ...(tree[person.father.person_id].spouses || []),
          person.mother.person_id,
        ];
      }
    }
  }

  return topmostAncestorId;
}

/**
 * Converts API response data to tree structure format
 * @param ancestorsData - Response from ancestors API
 * @param descendantsData - Response from descendants API
 * @param rootPersonId - ID of the root person
 * @returns Object with tree structure and root ID
 */
export function convertToTreeStructure(
  ancestorsData: AncestorsResponse | null,
  descendantsData: DescendantsResponse | null,
  rootPersonId: string,
): { tree: TreeStructure; rootId: string } {
  const tree: TreeStructure = {};

  console.log("Ancestors Data ::", ancestorsData);
  console.log("Descendants Data ::", descendantsData);

  // Start with descendants data (this includes the root person)
  if (descendantsData?.descendants) {
    const rootPerson = descendantsData.descendants;

    // Process root person and all descendants recursively
    processPersonAndDescendants(rootPerson, tree);

    // Mark root person with type "input"
    if (tree[rootPerson.person_id]) {
      tree[rootPerson.person_id].type = "input";
    }
  }

  // Add ancestors data - process father's lineage recursively
  let finalRootId = rootPersonId;

  if (ancestorsData?.ancestors) {
    const rootPerson = ancestorsData.ancestors;

    // Update root person if not already added
    if (!tree[rootPerson.person_id]) {
      tree[rootPerson.person_id] = {
        id: rootPerson.person_id,
        name: rootPerson.full_name,
        image: rootPerson.photo,
        children: [],
        spouses: [],
        parents: [],
      };
    }

    // Process father's lineage recursively (this will mark fathers with type "input")
    if (rootPerson.father) {
      const topmostFatherAncestorId = processAncestorsRecursively(
        rootPerson.father,
        tree,
        rootPerson.person_id,
        true, // Mark as direct father lineage
      );

      // The topmost father ancestor becomes the root
      finalRootId = topmostFatherAncestorId;

      // Update root person's parents to include father
      if (
        !tree[rootPerson.person_id].parents?.includes(
          rootPerson.father.person_id,
        )
      ) {
        tree[rootPerson.person_id].parents = [
          ...(tree[rootPerson.person_id].parents || []),
          rootPerson.father.person_id,
        ];
      }
    }

    // Process mother (but don't make her part of the main lineage)
    if (rootPerson.mother) {
      if (!tree[rootPerson.mother.person_id]) {
        tree[rootPerson.mother.person_id] = {
          id: rootPerson.mother.person_id,
          name: rootPerson.mother.full_name,
          image: rootPerson.mother.photo,
          children: [rootPerson.person_id],
          isSpouse: true,
          spouses: rootPerson.father ? [rootPerson.father.person_id] : [],
        };
      }

      // Add mother as parent to root person
      if (
        !tree[rootPerson.person_id].parents?.includes(
          rootPerson.mother.person_id,
        )
      ) {
        tree[rootPerson.person_id].parents = [
          ...(tree[rootPerson.person_id].parents || []),
          rootPerson.mother.person_id,
        ];
      }

      // Add mother as spouse to father if father exists
      if (rootPerson.father && tree[rootPerson.father.person_id]) {
        if (
          !tree[rootPerson.father.person_id].spouses?.includes(
            rootPerson.mother.person_id,
          )
        ) {
          tree[rootPerson.father.person_id].spouses = [
            ...(tree[rootPerson.father.person_id].spouses || []),
            rootPerson.mother.person_id,
          ];
        }
      }
    }
  }

  // If no ancestors were found, use the original root person
  if (!finalRootId) {
    finalRootId =
      Object.keys(tree).find((id) => tree[id].type === "input") ||
      rootPersonId ||
      Object.keys(tree)[0];
  }

  // Ensure the final root has the 'input' type
  if (finalRootId && tree[finalRootId]) {
    tree[finalRootId].type = "input";
  }

  console.log("Final Tree ::", tree);
  console.log("Final Root ID ::", finalRootId);
  console.log("finalRootId:", finalRootId);
  console.log("finalRootId children:", tree[finalRootId]?.children);
  console.log("rootPersonId:", rootPersonId);
  console.log("rootPersonId parents:", tree[rootPersonId]?.parents);
  return {
    tree,
    rootId: finalRootId || rootPersonId || Object.keys(tree)[0],
  };
}

/**
 * Helper function to get a person's image URL with fallback
 */
export function getPersonImage(photo?: string | null): string {
  return photo || fallbackImage;
}

/**
 * Helper function to format person's name
 */
export function formatPersonName(fullName: string): string {
  return fullName || "Unknown";
}
