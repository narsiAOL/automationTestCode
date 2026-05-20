import React, { memo, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useImageWithFallback } from "../../../hooks/useImageWithFallback";
import Tooltip from "../../ui/Tooltip";
import fallBackImage from "../../../assets/svgs/fallback-image.svg";
import GropIcon from "../../../assets/svgs/Group.svg";
import {
  DrawerProvider,
  useDrawer,
  type FormField,
} from "../../../contexts/DrawerContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts";
import { isAdmin } from "../../../utils/userUtils";
import { useGetFamilies } from "../../../hooks/useGetFamilies";
import DeleteIcon from "../../ui/DeleteIcon";

// use the provided Group.svg; fall back to fallback image if needed
const GroupIcon = GropIcon || fallBackImage;

const { Top, Bottom, Left, Right } = Position;

export const CustomNode = memo(({ data }: { data: any }) => {
  const {
    id,
    label,
    description,
    isRoot,
    image,
    isSpouse,
    isAttachedFamily,
    familyId,
    children = [],
    spouses = [],
    siblings = [],
  } = data;
  const { imageUrl: safeImageUrl, isLoading } = useImageWithFallback(image, {
    fallbackUrl: fallBackImage,
    timeoutMs: 5000,
  });

  // Responsive sizing
  const isMobile = window.innerWidth < 768;
  const cardWidth = isMobile ? 90 : 130;
  const imageHeight = isMobile ? 100 : 150;
  const fontSize = isMobile ? 9 : 18;
  const borderRadius = isMobile ? 10 : 12;
  const paddingBottom = isMobile ? 14 : 16;
  const namePaddingX = isMobile ? 6 : 8;
  const nameMarginTop = isMobile ? 6 : 8;

  const hasChildren = children.length > 0;
  const hasSpouses = spouses.length > 0;
  // spouseOnRight is set by layout; default true
  const spouseOnRight = data.spouseOnRight !== false;

  const getTargetPosition = () => {
    return Top;
  };
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdminUser = isAdmin(user);
  const { families, loading: familiesLoading } = useGetFamilies();
  console.log("Families in CustomNode:", families, "Loading:", familiesLoading);

  const shouldShowParentTarget = () => {
    if (isRoot) return data.parents?.length > 0;
    if (isSpouse) return false; // spouse nodes only connect via spouse-target handle
    return true;
  };
  const { openDrawer, formFields: drawerFormFields } = useDrawer();
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState({
    open: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!contextMenu.open) return;

      const target = event.target as Node;
      const clickedInsideCard = cardRef.current?.contains(target);
      const clickedInsideMenu = menuRef.current?.contains(target);

      if (!clickedInsideCard && !clickedInsideMenu) {
        setContextMenu((prev) => ({ ...prev, open: false }));
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [contextMenu.open]);

  const openInNewTab = () => {
    window.open(`/member-profile/${id}`, "_blank");
    setContextMenu((prev) => ({ ...prev, open: false }));
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      open: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // const profileData = dummyProfileData.personal_details;
  const formFields: FormField[] = [
    {
      name: "person_id",
      label: "Person ID",
      type: "text",
      value: "",
    },
    {
      name: "search",
      label: t("dashboard.profile.personalDetails.search", "Search"),
      type: "search",
      value:
        drawerFormFields?.find((field) => field.name === "search")?.value || "",
      placeholder: t(
        "dashboard.profile.personalDetails.searchPlaceholder",
        "Search by Kutumbh No., Page no, Name, etc",
      ),
    },
    {
      name: "type",
      label: t(
        "dashboard.profile.personalDetails.relationshipType",
        "Relationship Type",
      ),
      type: "select",
      value:
        drawerFormFields?.find((field) => field.name === "type")?.value ||
        "father",
      options: [
        {
          label: t("dashboard.profile.personalDetails.father", "Father"),
          value: "father",
        },
        {
          label: t("dashboard.profile.personalDetails.mother", "Mother"),
          value: "mother",
        },
        {
          label: t("dashboard.profile.personalDetails.spouse", "Spouse"),
          value: "spouse",
        },
        {
          label: t("dashboard.profile.personalDetails.sibling", "Sibling"),
          value: "sibling",
        },
        {
          label: t("dashboard.profile.personalDetails.son", "Son"),
          value: "son",
        },
        {
          label: t("dashboard.profile.personalDetails.daughter", "Daughter"),
          value: "daughter",
        },
      ],
    },
    {
      name: "photo",
      label: t("dashboard.profile.personalDetails.photo", "Profile Photo"),
      type: "file",
      value:
        drawerFormFields?.find((field) => field.name === "photo")?.value || "",
      accept: "image/*",
      placeholder: "Choose profile photo",
    },
    {
      name: "firstname",
      label: t("dashboard.profile.personalDetails.firstName", "First Name"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "firstname")?.value ||
        "",
      required: true,
    },
    {
      name: "lastname",
      label: t("dashboard.profile.personalDetails.lastName", "Last Name"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "lastname")?.value ||
        "",
    },
    {
      name: "surname",
      label: t("dashboard.profile.personalDetails.surname", "Surname"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "surname")?.value ||
        "",
      required: true,
    },
    {
      name: "family_id",
      label: t("dashboard.profile.personalDetails.familyId", "Families"),
      type: "select",
      value:
        drawerFormFields?.find((field) => field.name === "family_id")?.value ||
        "",
      options:
        families?.map((family) => ({
          value: family.id,
          label: family.family_name,
        })) || [],
    },
    {
      name: "gender",
      label: t("dashboard.profile.personalDetails.gender", "Gender"),
      type: "select",
      value:
        drawerFormFields?.find((field) => field.name === "gender")?.value || "",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    {
      name: "dob",
      label: t(
        "dashboard.profile.personalDetails.dateOfBirth",
        "Date of Birth",
      ),
      type: "date",
      value:
        drawerFormFields?.find((field) => field.name === "dob")?.value || "",
    },
    {
      name: "dod",
      label: t(
        "dashboard.profile.personalDetails.dateOfDeath",
        "Date of Death",
      ),
      type: "date",
      value:
        drawerFormFields?.find((field) => field.name === "dod")?.value || "",
    },
    {
      name: "pob",
      label: t(
        "dashboard.profile.personalDetails.placeOfBirth",
        "Place of Birth",
      ),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "pob")?.value || "",
    },
    {
      name: "gothra",
      label: t("dashboard.profile.personalDetails.gotra", "Gotra"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "gothra")?.value || "",
    },
    {
      name: "blood_group",
      label: t("dashboard.profile.personalDetails.bloodGroup", "Blood Group"),
      type: "select",
      value:
        drawerFormFields?.find((field) => field.name === "blood_group")
          ?.value || "",
      options: [
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" },
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" },
      ],
    },
    {
      name: "marriage_date",
      label: t(
        "dashboard.profile.personalDetails.dateOfMarriage",
        "Date of Marriage",
      ),
      type: "date",
      value:
        drawerFormFields?.find((field) => field.name === "marriage_date")
          ?.value || "",
    },
    {
      name: "state",
      label: t("dashboard.profile.personalDetails.state", "State"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "state")?.value || "",
    },
    {
      name: "city",
      label: t("dashboard.profile.personalDetails.city", "City"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "city")?.value || "",
    },
    {
      name: "pincode",
      label: t("dashboard.profile.personalDetails.pincode", "Pincode"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "pincode")?.value ||
        "",
    },
    {
      name: "country",
      label: t("dashboard.profile.personalDetails.country", "Country"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "country")?.value ||
        "",
    },
    {
      name: "residentialAddress",
      label: t(
        "dashboard.profile.personalDetails.residentialAddress",
        "Residential Address",
      ),
      type: "textarea",
      value:
        drawerFormFields?.find((field) => field.name === "residentialAddress")
          ?.value || "",
    },
    {
      name: "education",
      label: t("dashboard.profile.personalDetails.education", "Education"),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "education")?.value ||
        "",
    },
    {
      name: "email",
      label: t("dashboard.profile.personalDetails.email", "Email"),
      type: "email",
      value:
        drawerFormFields?.find((field) => field.name === "email")?.value || "",
    },
    {
      name: "mobile",
      label: t("dashboard.profile.personalDetails.mobile", "Mobile"),
      type: "tel",
      value:
        drawerFormFields?.find((field) => field.name === "mobile")?.value || "",
    },
    {
      name: "whatsapp",
      label: t("dashboard.profile.personalDetails.whatsapp", "WhatsApp"),
      type: "tel",
      value:
        drawerFormFields?.find((field) => field.name === "whatsapp")?.value ||
        "",
    },
    {
      name: "kutumbhNo",
      label: t("dashboard.profile.personalDetails.kutumbhNo", {
        defaultValue: "Kutumbh No.",
      }),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "kutumbhNo")?.value ||
        "",
    },
    {
      name: "pageNo",
      label: t("dashboard.profile.personalDetails.pageNo", {
        defaultValue: "Page No.",
      }),
      type: "text",
      value:
        drawerFormFields?.find((field) => field.name === "pageNo")?.value || "",
    },
  ];
  // prefer using drawer controls from context when available; otherwise emit an event

  const handleGroupClick = (e) => {
    e.stopPropagation();
    const title = t("dashboard.profile.personalDetails.addPerson", {
      defaultValue: "Add Person",
    });
    if (openDrawer) {
      openDrawer(title, formFields);
    } else {
      window.dispatchEvent(
        new CustomEvent("open-edit-drawer", {
          detail: {
            personId: data?.id,
            title,
            isPersonalDetails: true,
          },
        }),
      );
    }
  };

  // Node click handler
  const handleNodeClick = (e) => {
    e.stopPropagation();
    if (data && typeof data.onNodeClick === "function") {
      // Pass both id and formFields to parent
      data.onNodeClick(data.id, formFields);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof data.onDeletePerson === "function") {
      data.onDeletePerson(id, label);
    }
  };

  // Render a distinct card for attached family nodes
  if (isAttachedFamily) {
    const handleAttachedFamilyClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (familyId && typeof data.onAttachedFamilyClick === "function") {
        data.onAttachedFamilyClick(familyId);
      }
    };

    return (
      <div className="nodrag" style={{ pointerEvents: "all" }}>
        <Handle type="target" position={Top} id="parent-target" />
        <div
          style={{
            width: cardWidth,
            // backgroundColor: "#ffffff",
            borderRadius: borderRadius,
            overflow: "hidden",
            // boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            // border: "2px dashed #1613c7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0px 0px 150px",
            gap: 6,
            // cursor: "pointer",
          }}
        >
          <p
            style={{
              fontSize: fontSize,
              textAlign: "center",
              color: "#1613c7",
              fontWeight: 600,
              lineHeight: 1.3,
              margin: 0,
              wordBreak: "break-word",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={handleAttachedFamilyClick}
          >
            {description || label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="nodrag" style={{ pointerEvents: "all" }}>
      {hasChildren && (
        <Handle type="source" position={Bottom} id="child-source" />
      )}

      {/* Spouse source handles: single-spouse uses "spouse-source"; multi-spouse
          uses "spouse-source-right" / "spouse-source-left" (both always rendered
          so the layout's edge sourceHandle can route to whichever is relevant). */}
      {hasSpouses && !isSpouse && (
        <>
          <Handle
            type="source"
            position={spouseOnRight ? Right : Left}
            id="spouse-source"
            className="spouse-hidden-handle"
            style={{ top: "50%" }}
            isConnectable={false}
          />
          <Handle
            type="source"
            position={Right}
            id="spouse-source-right"
            className="spouse-hidden-handle"
            style={{ top: "50%" }}
            isConnectable={false}
          />
          <Handle
            type="source"
            position={Left}
            id="spouse-source-left"
            className="spouse-hidden-handle"
            style={{ top: "50%" }}
            isConnectable={false}
          />
        </>
      )}
      {isSpouse && (
        <Handle
          type="target"
          position={spouseOnRight ? Left : Right}
          id="spouse-target"
          className="spouse-hidden-handle"
          style={{ top: spouseOnRight ? "50%" : "50%" }}
          isConnectable={false}
        />
      )}

      {shouldShowParentTarget() && (
        <Handle
          type="target"
          position={getTargetPosition()}
          id="parent-target"
        />
      )}

      {/* Card */}
      <div
        style={{
          width: cardWidth,
          backgroundColor: "#F5EFE6",
          borderRadius: borderRadius,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: paddingBottom,
        }}
        ref={cardRef}
        onContextMenu={handleContextMenu}
      >
        {/* Photo */}
        <div
          style={{
            width: "100%",
            height: imageHeight,
            overflow: "hidden",
            borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
            flexShrink: 0,
          }}
        >
          {isLoading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: fontSize - 2 }}>
                Loading...
              </span>
            </div>
          ) : (
            <img
              src={safeImageUrl}
              alt={label || "Profile"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e5e7eb"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23374151">No Image</text></svg>';
              }}
            />
          )}
        </div>

        {/* Name */}
        <Tooltip content={label} asBlock className="w-full">
          <div className="group relative flex w-full flex-col items-center pb-3 border border-[#906D49] rounded-[6px]">
            {/* Label Box */}
            <p
              className="
                flex w-full items-center justify-center
                py-2
                text-center
                px-2"
            >
              <span className="text-[12px] leading-tight line-clamp-2 w-full">
                {label}
              </span>
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openInNewTab();
              }}
              className="absolute right-[-2px] top-[-12px] flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DAD1BC] text-[#3D2B1F] shadow-sm hover:bg-[#f5f2ec] cursor-pointer transition-colors"
              aria-label={t("dashboard.profile.openInNewTab", "Go to profile")}
              title={t("dashboard.profile.openInNewTab", "Go to profile")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="12"
                height="12"
              >
                <path d="M14 3h7v7h-2V6.414L8.414 20H6v-2.414L17.586 4H14V3z" />
              </svg>
            </button>
            {/* Bottom Center Icon (attached) */}
            {isAdminUser && (
              <img
                onClick={handleNodeClick}
                src={GroupIcon}
                alt="group"
                className={` w-6 h-6
                absolute
                left-1/2 bottom-0
                -translate-x-1/2 translate-y-1/2 cursor-pointer ${isSpouse ? "hidden" : ""}`}
              />
            )}
            {/* Delete icon — admin only, top-left */}
            {isAdminUser && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="absolute left-[-2px] top-[-12px] flex p-1 items-center justify-center rounded-full bg-white border border-[#DAD1BC] text-red-500 shadow-sm hover:bg-red-50 cursor-pointer transition-colors"
                aria-label="Delete person"
                title="Delete person"
              >
                <DeleteIcon size={16} />
              </button>
            )}
          </div>
        </Tooltip>
      </div>
      {contextMenu.open && (
        <div
          ref={menuRef}
          className="fixed rounded-lg border border-[#DAD1BC] bg-white shadow-lg"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 200),
            top: Math.min(contextMenu.y, window.innerHeight - 120),
            minWidth: 180,
            zIndex: 9999,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="w-full px-4 py-3 text-left text-sm text-[#3d2b1f] hover:bg-[#f5f2ec]"
            onClick={openInNewTab}
          >
            Open in new tab
          </button>
        </div>
      )}
      {/* Edit Drawer */}
    </div>
  );
});
