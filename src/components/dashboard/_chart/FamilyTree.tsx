import { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  useNodesInitialized,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./xy-theme.css";

import { layoutElements } from "./layout-elements";
import { ChartOptions, ZoomControls } from "../../ui/chartItems";
import useFamilyTree from "../../../hooks/useFamilyTree";
import Loader from "../../ui/Loader";
import { CustomNode } from "./CustomNode";
import { EditDrawer } from "../../ui";
import { DrawerProvider, useDrawer, type FormField } from "../../../contexts";
import EditForm from "../EditForm";
import peopleService from "../../../services/people";
import userService from "../../../services/user";
import { mapFormDataToPersonalDetailsAPI } from "../../../utils/formDataMapper";
import { useToast } from "../../../hooks/useToast";
import { personFormSchema } from "../../../validation/personFormSchema";
import ConfirmationModal from "../../ui/ConfirmationModal";

const nodeTypes = {
  custom: CustomNode,
};

interface FamilyTreeProps {
  personId?: string;
  onAttachedFamilyClick?: (familyId: string) => void;
}

// Detect mobile viewport
const isMobile = () => window.innerWidth < 768;

const FamilyTreeComponent = ({
  personId,
  onAttachedFamilyClick,
}: FamilyTreeProps) => {
  const {
    tree,
    rootId,
    loading,
    error,
    ancestorsLevel,
    descendantsLevel,
    updateAncestors,
    updateDescendants,
    refetch,
  } = useFamilyTree({ personId });
  console.log("Family tree data:", tree);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  const { fitView, zoomIn, zoomOut, getZoom } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const [pendingFitView, setPendingFitView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [mobile, setMobile] = useState(isMobile());
  const [message, setMessage] = useState(null);
  const prevAncestorsRef = useRef(ancestorsLevel);
  const prevDescendantsRef = useRef(descendantsLevel);

  // Center scroll position after tree finishes loading
  useEffect(() => {
    if (!showInitialLoader && wrapperRef.current) {
      const el = wrapperRef.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    }
  }, [showInitialLoader]);

  // Track mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
      if (wrapperRef.current) {
        setWrapperSize({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    isDrawerOpen,
    drawerTitle,
    closeDrawer,
    openDrawer,
    formFields,
    resetForm,
    setLoading,
    setError,
  } = useDrawer();
  const { showSuccess, showError } = useToast();
  const [selectedPersonId, setSelectedPersonId] = useState<string | undefined>(
    undefined,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const handleFamilyTreeSave = async (
    formData: Record<string, string>,
    fields: FormField[],
  ) => {
    // If a family was selected, send only person_id + family_id directly — no other validation
    if (formData.family_id) {
      setLoading(true);
      setError(null);
      try {
        await peopleService.updatePersonalDetails({
          person_id: selectedPersonId,
          attached_family_id: formData.family_id,
        });
        showSuccess("Successfully Linked family");
        resetForm();
        closeDrawer();
      } catch (err: any) {
        const errorData = err.response?.data;
        const errorMessage =
          errorData?.message ||
          errorData?.data ||
          err.message ||
          "Failed to save";
        showError(`Failed: ${errorMessage}`);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Zod validation
    const validation = personFormSchema.safeParse(formData);
    if (!validation.success) {
      // Map Zod errors to fieldErrors
      const errors: Record<string, string> = {};
      for (const key in validation.error.flatten().fieldErrors) {
        const errArr = validation.error.flatten().fieldErrors[key];
        if (errArr && errArr.length > 0) errors[key] = errArr[0];
      }
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    // type is required for add-person flow
    if (!formData.type) {
      showError("Relationship type is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const photoField = fields.find((f) => f.name === "photo");
      const safePhoto: any = formData.photo ?? "";
      let photoUrl =
        typeof safePhoto === "object" && safePhoto !== null
          ? safePhoto.value
          : safePhoto;
      if (
        photoField &&
        typeof safePhoto === "object" &&
        safePhoto !== null &&
        safePhoto.file
      ) {
        try {
          const uploadResult = await userService.uploadAvatar(
            safePhoto.file as File,
          );
          photoUrl = uploadResult.avatarUrl;
        } catch (uploadError) {
          console.warn(
            "Avatar upload failed, continuing with existing photo.",
            uploadError,
          );
        }
      }
      let isDescendentAdded = false;
      let isAncestorAdded = false;
      if (formData.type === "father" || formData.type === "mother") {
        isAncestorAdded = true;
      }
      if (formData.type === "son" || formData.type === "daughter") {
        isDescendentAdded = true;
      }

      let finalPersonId = formData.person_id;
      const apiPayload = mapFormDataToPersonalDetailsAPI(
        { ...formData, photo: photoUrl },
        finalPersonId,
      );

      if (finalPersonId) {
        await peopleService.updatePersonalDetails(apiPayload);
      } else {
        const addResponse = await peopleService.addPerson(apiPayload);
        finalPersonId =
          addResponse?.data?.person_id ||
          addResponse?.person_id ||
          apiPayload.person_id;
      }

      if (selectedPersonId && finalPersonId) {
        let relationshipType = formData.type || "father";
        if (relationshipType === "son" || relationshipType === "daughter") {
          relationshipType = "child";
          isDescendentAdded = true;
        }
        await peopleService.updateMember({
          person_id: selectedPersonId,
          member_id: finalPersonId,
          type: relationshipType,
          marriage_date: formData.marriage_date || "",
        });
      }

      showSuccess("Successfully updated the relative link");
      resetForm();
      closeDrawer();
      if (isAncestorAdded) {
        updateAncestors(ancestorsLevel + 1);
      }
      if (isDescendentAdded) {
        updateDescendants(descendantsLevel + 1);
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage =
        errorData?.message ||
        errorData?.data ||
        err.message ||
        "Failed to save";
      showError(`Failed: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handler to receive node id and formFields on click
  const handleNodeClick = useCallback(
    (id: string, fields: any[]) => {
      setSelectedPersonId(id);
      console.log("Fields for selected node:", id, fields);
      openDrawer("Add Person", fields);
    },
    [openDrawer],
  );

  const handleDeletePerson = useCallback(
    async (personId: string) => {
      try {
        await peopleService.deletePerson(personId);
        showSuccess("Person deleted successfully");
        refetch();
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to delete";
        showError(`Failed: ${errorMessage}`);
      }
    },
    [refetch, showSuccess, showError],
  );

  const handleDeleteClick = useCallback((personId: string, label: string) => {
    setDeleteTarget({ id: personId, label });
  }, []);

  // Inject onNodeClick handler into node data
  const { nodes: layoutedNodes, edges: layoutedEdges } =
    tree && Object.keys(tree).length > 0
      ? layoutElements(tree, rootId, "TB")
      : { nodes: [], edges: [] };

  // Helper to inject handler into nodes
  const injectHandler = (nodes) =>
    nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onNodeClick: handleNodeClick,
        onAttachedFamilyClick,
        onDeletePerson: handleDeleteClick,
      },
    }));

  const [nodes, setNodes, onNodesChange] = useNodesState(
    injectHandler(layoutedNodes),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
    setTimeout(() => setCurrentZoom(getZoom()), 220);
  }, [zoomIn, getZoom]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
    setTimeout(() => setCurrentZoom(getZoom()), 220);
  }, [zoomOut, getZoom]);

  const onMoveEnd = useCallback(() => {
    setCurrentZoom(getZoom());
  }, [getZoom]);

  // Fire fitView only after ReactFlow has measured all nodes
  useEffect(() => {
    if (!nodesInitialized || !pendingFitView) return;
    setPendingFitView(false);
    fitView({ duration: 300, padding: mobile ? 0.3 : 0.1 });
    setShowInitialLoader(false);
    setMessage(null);
    setIsTransitioning(false);
    setTimeout(() => setCurrentZoom(getZoom()), 350);
  }, [nodesInitialized, pendingFitView, fitView, mobile, getZoom]);

  // Reset display state whenever personId changes so stale message/loader don't persist
  useEffect(() => {
    setShowInitialLoader(true);
    setMessage(null);
    setPendingFitView(false);
  }, [personId]);

  // Unified tree effect: runs whenever tree or loading changes
  useEffect(() => {
    // Level change detected → fade out old tree
    if (
      loading &&
      (prevAncestorsRef.current !== ancestorsLevel ||
        prevDescendantsRef.current !== descendantsLevel)
    ) {
      setIsTransitioning(true);
    }

    prevAncestorsRef.current = ancestorsLevel;
    prevDescendantsRef.current = descendantsLevel;

    if (loading) return;

    if (!tree || Object.keys(tree).length === 0) {
      setShowInitialLoader(false);
      setMessage("No family tree data available for this person.");
      return;
    }

    const { nodes: newLayoutedNodes, edges: newLayoutedEdges } = layoutElements(
      tree,
      rootId,
      "TB",
    );
    setNodes(injectHandler(newLayoutedNodes));
    setEdges(newLayoutedEdges);
    setPendingFitView(true);
  }, [
    tree,
    rootId,
    loading,
    ancestorsLevel,
    descendantsLevel,
    setNodes,
    setEdges,
  ]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );

  const renderTree = () => {
    if (error) {
      return (
        <div className="h-full w-full rounded-lg bg-primary-200 relative flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      );
    }

    const getTreeOpacity = () => {
      if (isTransitioning || loading) return 0;
      return 1;
    };
    if (!showInitialLoader && message) {
      return (
        <div className="absolute inset-0 z-50 bg-primary-200 rounded-lg flex items-center justify-center">
          <div className="text-gray-600 text-lg">{message}</div>
        </div>
      );
    }

    return (
      <div
        ref={wrapperRef}
        className="wrapper-container family-tree-scroll h-full w-full overflow-auto relative"
      >
        <div
          className="transition-opacity duration-300 ease-in-out h-full w-full"
          style={{
            opacity: getTreeOpacity(),
            // minWidth: mobile ? "1800px" : "3000px",
            minHeight: mobile ? "1200px" : "2000px",
            height: "100%",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onMoveEnd={onMoveEnd}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView={false}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            // Allow pinch zoom on mobile, disable scroll zoom on desktop
            zoomOnScroll={false}
            zoomOnPinch={true} // ← enable pinch-to-zoom on mobile
            zoomOnDoubleClick={false}
            panOnDrag={true} // ← allow pan/drag on mobile
            panOnScroll={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            defaultViewport={{ x: 0, y: 0, zoom: 0.3 }}
            minZoom={mobile ? 0.1 : 0.2} // allow zooming out far enough to see full tree
            maxZoom={1.5}
          ></ReactFlow>
        </div>

        {showInitialLoader && (
          <div className="absolute inset-0 z-50 bg-primary-200 rounded-lg flex items-center justify-center">
            <Loader
              message="Loading family tree..."
              spinnerClassName="w-10 h-10 border-4"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-[500px] rounded-lg bg-primary-200 relative">
      <div className="absolute top-4 left-4 z-10">
        <ChartOptions
          ancestorsCount={ancestorsLevel}
          descendantsCount={descendantsLevel}
          onAncestorsChange={updateAncestors}
          onDescendantsChange={updateDescendants}
        />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          currentZoom={currentZoom}
        />
      </div>

      {renderTree()}
      <EditDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={drawerTitle}
      >
        <EditForm
          onSave={handleFamilyTreeSave}
          saveButtonText="Add"
          formError={fieldErrors}
        />
        {/* dynamic form here */}
      </EditDrawer>
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Person"
        message={`Are you sure you want to delete ${deleteTarget?.label ?? ""}? This action cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDeletePerson(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

const FamilyTree = (props: FamilyTreeProps) => (
  <DrawerProvider>
    <ReactFlowProvider>
      <FamilyTreeComponent {...props} />
    </ReactFlowProvider>
  </DrawerProvider>
);

export default FamilyTree;
