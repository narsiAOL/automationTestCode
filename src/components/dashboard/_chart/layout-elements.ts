import { Position, type Node, type Edge } from "@xyflow/react";
import { layoutFromMap } from "entitree-flex";

interface TreeNode {
  id: string;
  name: string;
  parents?: string[];
  children?: string[];
  spouses?: string[];
  siblings?: string[];
  [key: string]: any;
}

interface TreeMap {
  [id: string]: TreeNode;
}

interface CustomNodeData extends TreeNode {
  label: string;
  isRoot: boolean;
}

const nodeWidth = 150;
const nodeHeight = 250;
const Top: Position = Position.Top;
const Bottom: Position = Position.Bottom;
const Left: Position = Position.Left;
const Right: Position = Position.Right;

const Orientation = {
  Vertical: "vertical",
  Horizontal: "horizontal",
} as const;

const entitreeSettings = {
  clone: true,
  enableFlex: true,
  firstDegreeSpacing: 200,
  nextAfterAccessor: "spouses",
  nextAfterSpacing: 100,
  nextBeforeAccessor: "siblings",
  nextBeforeSpacing: 100,
  nodeHeight,
  nodeWidth,
  orientation: Orientation.Vertical,
  rootX: 0,
  rootY: 0,
  secondDegreeSpacing: 100,
  sourcesAccessor: "parents",
  sourceTargetSpacing: 100,
  targetsAccessor: "children",
};

export const layoutElements = (
  tree: TreeMap,
  rootId: string,
  direction: "TB" | "LR" = "TB",
): { nodes: Node<CustomNodeData>[]; edges: Edge[] } => {
  const isTreeHorizontal = direction === "LR";

  const { nodes: entitreeNodes } = layoutFromMap(rootId, tree, {
    ...entitreeSettings,
    orientation: isTreeHorizontal
      ? Orientation.Horizontal
      : Orientation.Vertical,
  });

  // console.log('entitreeNodes:', entitreeNodes);
  const nodes: Node<CustomNodeData>[] = entitreeNodes.map((node: any) => ({
    id: String(node.id),
    type: "custom",
    data: {
      label: node.name,
      isRoot: node.id === rootId,
      ...node,
    },
    width: nodeWidth,
    height: nodeHeight,
    position: { x: node.x, y: node.y },
    sourcePosition: node.isSpouse ? Right : node.isSibling ? Left : Bottom,
    targetPosition: node.isSpouse ? Left : node.isSibling ? Right : Top,
  }));

  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  const pushEdge = (
    id: string,
    source: string,
    target: string,
    sourceHandle?: string,
    targetHandle?: string,
  ) => {
    if (edgeSet.has(id)) return;
    edgeSet.add(id);
    edges.push({
      id,
      source,
      target,
      type: "smoothstep",
      animated: false,
      sourceHandle,
      targetHandle,
      style: { stroke: "#733e0a", strokeWidth: 2 },
    });
  };

  // --- Pre-compute multi-spouse info ---
  const pairGroups: Record<string, string[]> = {};
  Object.values(tree).forEach((tn) => {
    const childId = String(tn.id);
    const parents = (tn.parents || []).map(String);
    if (parents.length === 2) {
      const key = parents.sort().join("__");
      pairGroups[key] = pairGroups[key] || [];
      pairGroups[key].push(childId);
    }
  });

  // IDs of persons with 2+ spouses
  const multiSpousePersonIds = new Set<string>(
    Object.values(tree)
      .filter((n) => (n.spouses || []).length >= 2)
      .map((n) => String(n.id)),
  );

  // IDs of couple-specific children (2 parents) whose main parent is a multi-spouse person
  const handledBySpouseIds = new Set<string>();
  Object.entries(pairGroups).forEach(([key, childIds]) => {
    const [p1, p2] = key.split("__");
    if (multiSpousePersonIds.has(p1) || multiSpousePersonIds.has(p2)) {
      childIds.forEach((cid) => handledBySpouseIds.add(cid));
    }
  });

  // IDs of unassigned children (1 parent = multi-spouse main person)
  const handledByMainIds = new Set<string>();
  Object.values(tree).forEach((tn) => {
    const parents = (tn.parents || []).map(String);
    if (parents.length === 1 && multiSpousePersonIds.has(parents[0])) {
      handledByMainIds.add(String(tn.id));
    }
  });

  // All children in multi-spouse groups that we handle explicitly
  const explicitlyHandledIds = new Set<string>([
    ...handledBySpouseIds,
    ...handledByMainIds,
  ]);

  // --- Parent → Child edges (skip nodes we handle explicitly) ---
  Object.values(tree).forEach((node) => {
    const src = node.id;
    (node.children || []).forEach((childId) => {
      if (!tree[childId]) return;
      if (explicitlyHandledIds.has(childId)) return;
      pushEdge(
        `e_${src}_${childId}`,
        src,
        childId,
        "child-source",
        "parent-target",
      );
    });
  });

  // Ensure edges from parent references (skip explicitly handled)
  Object.values(tree).forEach((node) => {
    const childId = node.id;
    if (explicitlyHandledIds.has(childId)) return;
    (node.parents || []).forEach((parentId) => {
      if (!tree[parentId]) return;
      pushEdge(
        `e_${parentId}_${childId}`,
        parentId,
        childId,
        "child-source",
        "parent-target",
      );
    });
  });

  const verticalSpacing = 350;
  const baseChildSpacing = 100;
  const spouseSpacing = 200;
  const nodeById = new Map<string, Node<CustomNodeData>>(
    nodes.map((n) => [String(n.id), n]),
  );

  // --- Step 1: Compact top-down placement ---
  // Siblings start at minimum spacing (nodeWidth + gap). No subtree-width inflation
  // at this stage — deep descendants do NOT widen sibling slots prematurely.
  const placedNodes = new Set<string>();
  const compactPlace = (nodeId: string, centerX: number, y: number) => {
    const node = nodeById.get(nodeId);
    if (!node || placedNodes.has(nodeId)) return;
    placedNodes.add(nodeId);
    node.position.x = centerX - nodeWidth / 2;
    node.position.y = y;

    const treeNode = tree[nodeId];
    if (!treeNode) return;
    const children = (treeNode.children || [])
      .map(String)
      .filter((cid) => nodeById.has(cid));
    if (children.length === 0) return;

    const totalW =
      children.length * nodeWidth + (children.length - 1) * baseChildSpacing;
    let curX = centerX - totalW / 2;
    const childY = y + verticalSpacing;
    children.forEach((cid) => {
      compactPlace(cid, curX + nodeWidth / 2, childY);
      curX += nodeWidth + baseChildSpacing;
    });
  };

  // --- Step 2: Reingold-Tilford contour-based separation ---
  // After compact placement, walk bottom-up: for each pair of adjacent siblings,
  // compare the right contour of the left subtree to the left contour of the
  // right subtree at every depth level and push the right subtree only as far
  // as needed. Nodes whose subtrees never collide stay close together.

  // Right contour: for each depth, the rightmost x+nodeWidth in the subtree
  const getRightContour = (
    nid: string,
    contour: number[] = [],
    depth = 0,
  ): number[] => {
    const n = nodeById.get(nid);
    if (!n) return contour;
    const right = n.position.x + nodeWidth;
    if (contour.length <= depth) contour.push(right);
    else contour[depth] = Math.max(contour[depth], right);
    (tree[nid]?.children || [])
      .map(String)
      .filter((cid) => nodeById.has(cid))
      .forEach((cid) => getRightContour(cid, contour, depth + 1));
    return contour;
  };

  // Left contour: for each depth, the leftmost x in the subtree
  const getLeftContour = (
    nid: string,
    contour: number[] = [],
    depth = 0,
  ): number[] => {
    const n = nodeById.get(nid);
    if (!n) return contour;
    const left = n.position.x;
    if (contour.length <= depth) contour.push(left);
    else contour[depth] = Math.min(contour[depth], left);
    (tree[nid]?.children || [])
      .map(String)
      .filter((cid) => nodeById.has(cid))
      .forEach((cid) => getLeftContour(cid, contour, depth + 1));
    return contour;
  };

  // Shift an entire subtree horizontally
  const shiftSubtree = (nid: string, dx: number) => {
    const n = nodeById.get(nid);
    if (!n) return;
    n.position.x += dx;
    (tree[nid]?.children || [])
      .map(String)
      .filter((cid) => nodeById.has(cid))
      .forEach((cid) => shiftSubtree(cid, dx));
  };

  // Bottom-up pass: fix overlapping sibling subtrees, then re-center parent
  const separateChildren = (nodeId: string) => {
    const treeNode = tree[nodeId];
    if (!treeNode) return;
    const children = (treeNode.children || [])
      .map(String)
      .filter((cid) => nodeById.has(cid));

    // Recurse into each child's subtree first (bottom-up)
    children.forEach((cid) => separateChildren(cid));

    if (children.length < 2) return;

    // Maintain a RUNNING right contour across all placed left siblings
    // (not just the immediate previous one). This prevents deep grandchildren
    // of an early sibling from "tunnelling" through a narrow intermediate leaf
    // and overlapping with later siblings' children.
    const runningRight: number[] = getRightContour(children[0]);

    for (let i = 1; i < children.length; i++) {
      const rightLeft = getLeftContour(children[i]);
      // Only compare where both contours have data (Math.min keeps it compact)
      const levels = Math.min(runningRight.length, rightLeft.length);
      let maxOverlap = 0;
      for (let l = 0; l < levels; l++) {
        const overlap = runningRight[l] + baseChildSpacing - rightLeft[l];
        if (overlap > maxOverlap) maxOverlap = overlap;
      }
      if (maxOverlap > 0) {
        shiftSubtree(children[i], maxOverlap);
      }
      // Merge children[i]'s (now shifted) right contour into runningRight
      const newRight = getRightContour(children[i]);
      for (let l = 0; l < Math.max(runningRight.length, newRight.length); l++) {
        if (l >= runningRight.length) runningRight.push(newRight[l]);
        else if (l < newRight.length)
          runningRight[l] = Math.max(runningRight[l], newRight[l]);
      }
    }

    // Re-center parent over its (now correctly separated) children
    const parent = nodeById.get(nodeId);
    if (!parent) return;
    const firstChild = nodeById.get(children[0])!;
    const lastChild = nodeById.get(children[children.length - 1])!;
    parent.position.x =
      firstChild.position.x +
      (lastChild.position.x + nodeWidth - firstChild.position.x) / 2 -
      nodeWidth / 2;
  };

  // Anchor at root, then run both passes
  const rootNode = nodeById.get(rootId);
  const rootCenterX = rootNode ? rootNode.position.x + nodeWidth / 2 : 0;
  const rootY = rootNode ? rootNode.position.y : 0;
  compactPlace(rootId, rootCenterX, rootY);
  separateChildren(rootId);
  // NOTE: spouse nodes and their couple-specific children are positioned
  // explicitly in the spouse-positioning block below.

  const COUPLE_GAP = 40;
  const processedPairs = new Set<string>();
  const spousePairs: Array<{
    main: Node<CustomNodeData>;
    spouse: Node<CustomNodeData>;
    mainId: string;
    spouseId: string;
    direction: "left" | "right";
  }> = [];

  // --- Spouse positioning ---
  // 1 spouse  → classic right-only (uses "spouse-source" handle)
  // 2+ spouses → split left/right (uses "spouse-source-left" / "spouse-source-right")
  Object.values(tree).forEach((node) => {
    const mainNode = nodeById.get(String(node.id));
    if (!mainNode || !node.spouses?.length) return;

    const validSpouseIds = (node.spouses as string[])
      .map(String)
      .filter((spId) => nodeById.has(spId));
    if (validSpouseIds.length === 0) return;

    // ---- Single spouse: classic right ----
    if (validSpouseIds.length === 1) {
      const spId = validSpouseIds[0];
      const spNode = nodeById.get(spId);
      if (!spNode) return;
      const key = [node.id, spId].sort().join("__");
      if (processedPairs.has(key)) return;
      processedPairs.add(key);

      spNode.position.x = mainNode.position.x + nodeWidth + COUPLE_GAP;
      spNode.position.y = mainNode.position.y;
      spNode.data = { ...spNode.data, spouseOnRight: true };
      mainNode.data = { ...mainNode.data, spouseOnRight: true };

      spousePairs.push({
        main: mainNode,
        spouse: spNode,
        mainId: node.id,
        spouseId: spId,
        direction: "right",
      });
      edges.push({
        id: `s_${key}`,
        source: node.id,
        target: spId,
        type: "straight",
        animated: false,
        sourceHandle: "spouse-source",
        targetHandle: "spouse-target",
        style: { stroke: "#733e0a", strokeWidth: 2 },
      });
      return;
    }

    // ---- 2+ spouses: first half LEFT, rest RIGHT ----
    const leftCount = Math.floor(validSpouseIds.length / 2);
    const leftSpouseIds = validSpouseIds.slice(0, leftCount);
    const rightSpouseIds = validSpouseIds.slice(leftCount);

    let rightCurX = mainNode.position.x + nodeWidth + COUPLE_GAP;
    rightSpouseIds.forEach((spId) => {
      const spNode = nodeById.get(spId);
      if (!spNode) return;
      const key = [node.id, spId].sort().join("__");
      if (processedPairs.has(key)) return;
      processedPairs.add(key);

      spNode.position.x = rightCurX;
      spNode.position.y = mainNode.position.y;
      spNode.data = { ...spNode.data, spouseOnRight: true };
      rightCurX += nodeWidth + COUPLE_GAP;

      spousePairs.push({
        main: mainNode,
        spouse: spNode,
        mainId: node.id,
        spouseId: spId,
        direction: "right",
      });
      edges.push({
        id: `s_${key}`,
        source: node.id,
        target: spId,
        type: "straight",
        animated: false,
        sourceHandle: "spouse-source-right",
        targetHandle: "spouse-target",
        style: { stroke: "#733e0a", strokeWidth: 2 },
      });
    });

    let leftCurX = mainNode.position.x - COUPLE_GAP - nodeWidth;
    leftSpouseIds.forEach((spId) => {
      const spNode = nodeById.get(spId);
      if (!spNode) return;
      const key = [node.id, spId].sort().join("__");
      if (processedPairs.has(key)) return;
      processedPairs.add(key);

      spNode.position.x = leftCurX;
      spNode.position.y = mainNode.position.y;
      spNode.data = { ...spNode.data, spouseOnRight: false };
      leftCurX -= nodeWidth + COUPLE_GAP;

      spousePairs.push({
        main: mainNode,
        spouse: spNode,
        mainId: node.id,
        spouseId: spId,
        direction: "left",
      });
      edges.push({
        id: `s_${key}`,
        source: node.id,
        target: spId,
        type: "straight",
        animated: false,
        sourceHandle: "spouse-source-left",
        targetHandle: "spouse-target",
        style: { stroke: "#733e0a", strokeWidth: 2 },
      });
    });
  });

  // --- Unified multi-spouse child layout ---
  // 1. compactPlace each top-level child (places its whole subtree top-down)
  // 2. separateChildren on each top-level child (Reingold-Tilford bottom-up within that subtree)
  // 3. Measure the actual subtree width
  // 4. Pack groups left→center→right with GROUP_GAP between them
  // 5. Center each parent (spouse / main) above its group
  const GROUP_GAP = 80;

  // Helper: actual left edge of a subtree rooted at nid
  const subtreeLeft = (nid: string): number => {
    const n = nodeById.get(nid);
    if (!n) return Infinity;
    let left = n.position.x;
    (tree[nid]?.children || [])
      .map(String)
      .filter((c) => nodeById.has(c))
      .forEach((c) => {
        left = Math.min(left, subtreeLeft(c));
      });
    return left;
  };

  // Helper: actual right edge of a subtree rooted at nid
  const subtreeRight = (nid: string): number => {
    const n = nodeById.get(nid);
    if (!n) return -Infinity;
    let right = n.position.x + nodeWidth;
    (tree[nid]?.children || [])
      .map(String)
      .filter((c) => nodeById.has(c))
      .forEach((c) => {
        right = Math.max(right, subtreeRight(c));
      });
    return right;
  };

  // Helper: shift an entire subtree (including descendants) by dx
  const shiftSubtreeAll = (nid: string, dx: number) => {
    const n = nodeById.get(nid);
    if (!n) return;
    n.position.x += dx;
    (tree[nid]?.children || [])
      .map(String)
      .filter((c) => nodeById.has(c))
      .forEach((c) => shiftSubtreeAll(c, dx));
  };

  multiSpousePersonIds.forEach((mainId) => {
    const mainNode = nodeById.get(mainId);
    if (!mainNode) return;

    const leftPairsLTR = spousePairs
      .filter((p) => p.mainId === mainId && p.direction === "left")
      .reverse();
    const rightPairs = spousePairs.filter(
      (p) => p.mainId === mainId && p.direction === "right",
    );

    const unassignedIds = [...handledByMainIds].filter((cid) => {
      const parents = (tree[cid]?.parents || []).map(String);
      return parents.length === 1 && parents[0] === mainId;
    });

    // Build ordered group list: left wives → main person → right wives
    const groups: Array<{
      parentId: string;
      parentNode: Node<CustomNodeData>;
      childIds: string[];
    }> = [];

    leftPairsLTR.forEach(({ spouseId, spouse }) => {
      const key = [mainId, spouseId].sort().join("__");
      const childIds = pairGroups[key] || [];
      if (childIds.length > 0)
        groups.push({ parentId: spouseId, parentNode: spouse, childIds });
    });

    if (unassignedIds.length > 0)
      groups.push({
        parentId: mainId,
        parentNode: mainNode,
        childIds: unassignedIds,
      });

    rightPairs.forEach(({ spouseId, spouse }) => {
      const key = [mainId, spouseId].sort().join("__");
      const childIds = pairGroups[key] || [];
      if (childIds.length > 0)
        groups.push({ parentId: spouseId, parentNode: spouse, childIds });
    });

    if (groups.length === 0) return;

    const childRowY = mainNode.position.y + verticalSpacing;

    // Step 1 & 2: place each group's subtrees side-by-side at a temporary origin,
    // run separation within the group, then record width
    const groupLayouts: Array<{
      parentId: string;
      parentNode: Node<CustomNodeData>;
      childIds: string[];
      subtreeWidth: number; // actual span after RT separation
    }> = [];

    let tempX = 0;
    groups.forEach((group) => {
      // Place all children in the group at tempX, separated by baseChildSpacing
      let cx = tempX;
      group.childIds.forEach((cid) => {
        compactPlace(cid, cx + nodeWidth / 2, childRowY);
        // Pin to packed position after compactPlace
        const cn = nodeById.get(cid);
        if (cn) cn.position.x = cx;
        cx += nodeWidth + baseChildSpacing;
      });

      // Run Reingold-Tilford separation within this group's children
      // by treating each child as an independent subtree and separating them
      for (let i = 1; i < group.childIds.length; i++) {
        const leftRight = getRightContour(group.childIds[i - 1]);
        const rightLeft = getLeftContour(group.childIds[i]);
        const levels = Math.min(leftRight.length, rightLeft.length);
        let maxOverlap = 0;
        for (let l = 0; l < levels; l++) {
          const overlap = leftRight[l] + baseChildSpacing - rightLeft[l];
          if (overlap > maxOverlap) maxOverlap = overlap;
        }
        if (maxOverlap > 0) shiftSubtree(group.childIds[i], maxOverlap);
      }
      // Also run full bottom-up pass on each child's own subtree
      group.childIds.forEach((cid) => separateChildren(cid));

      // Measure actual span
      const left = Math.min(...group.childIds.map(subtreeLeft));
      const right = Math.max(...group.childIds.map(subtreeRight));
      const width = right - left;
      groupLayouts.push({ ...group, subtreeWidth: width });

      // Advance tempX past this group
      tempX = right + GROUP_GAP;
    });

    // Step 3: Compute total width and anchor so mainNode's group stays centered over mainNode
    const dasCenterX = mainNode.position.x + nodeWidth / 2;
    const mainGroupIdx = groupLayouts.findIndex((g) => g.parentId === mainId);

    const totalWidth =
      groupLayouts.reduce((s, g) => s + g.subtreeWidth, 0) +
      (groupLayouts.length - 1) * GROUP_GAP;

    let startX: number;
    if (mainGroupIdx >= 0) {
      const widthBeforeMain = groupLayouts
        .slice(0, mainGroupIdx)
        .reduce((s, g) => s + g.subtreeWidth + GROUP_GAP, 0);
      startX =
        dasCenterX -
        groupLayouts[mainGroupIdx].subtreeWidth / 2 -
        widthBeforeMain;
    } else {
      startX = dasCenterX - totalWidth / 2;
    }

    // Step 4: Shift each group into its final position
    let curLeft = startX;
    groupLayouts.forEach((group) => {
      const currentLeft = Math.min(...group.childIds.map(subtreeLeft));
      const dx = curLeft - currentLeft;
      // Shift all subtrees in this group
      group.childIds.forEach((cid) => shiftSubtreeAll(cid, dx));

      // Step 5: Center the parent node above the group's actual span
      const finalLeft = Math.min(...group.childIds.map(subtreeLeft));
      const finalRight = Math.max(...group.childIds.map(subtreeRight));
      group.parentNode.position.x =
        (finalLeft + finalRight) / 2 - nodeWidth / 2;

      // Wire parent→child edges
      group.childIds.forEach((cid) => {
        pushEdge(
          `e_${group.parentId}_${cid}`,
          group.parentId,
          cid,
          "child-source",
          "parent-target",
        );
      });

      curLeft += group.subtreeWidth + GROUP_GAP;
    });
  });

  // --- Re-center single-spouse children under the couple midpoint ---
  // compactPlace positioned children under the main person. Now that spouses
  // have been placed to the right, re-center the shared children under the
  // midpoint of the couple so the edge drops straight down.
  spousePairs.forEach(
    ({ main: mainNode, spouse: spNode, mainId, spouseId, direction }) => {
      // Only for single-spouse persons (multi-spouse handled above)
      if (multiSpousePersonIds.has(mainId)) return;
      if (direction !== "right") return;

      const key = [mainId, spouseId].sort().join("__");
      const childIds = (pairGroups[key] || []).filter((cid) =>
        nodeById.has(cid),
      );
      if (childIds.length === 0) return;

      // Couple midpoint X
      const coupleMidX =
        (mainNode.position.x + spNode.position.x + nodeWidth) / 2;

      // Current center of the child group
      const groupLeft = Math.min(...childIds.map(subtreeLeft));
      const groupRight = Math.max(...childIds.map(subtreeRight));
      const groupMidX = (groupLeft + groupRight) / 2;

      const dx = coupleMidX - groupMidX;
      if (Math.abs(dx) > 0.5) {
        childIds.forEach((cid) => shiftSubtreeAll(cid, dx));
      }

      // Re-center main node above the couple+children arrangement:
      // keep main centered so the couple straddles the children naturally.
      // (spouse position is already locked; just ensure main stays left of it)
    },
  );

  // --- Straight line for single-child parents ---
  // Count how many child-edges each source node actually has in the final list,
  // then switch that edge to "straight" so it drops vertically instead of curving.
  const childEdgeCount = new Map<string, number>();
  edges.forEach((e) => {
    if (e.sourceHandle === "child-source") {
      childEdgeCount.set(e.source, (childEdgeCount.get(e.source) ?? 0) + 1);
    }
  });
  edges.forEach((e) => {
    if (
      e.sourceHandle === "child-source" &&
      childEdgeCount.get(e.source) === 1
    ) {
      e.type = "straight";
    }
  });

  return { nodes, edges };
};
