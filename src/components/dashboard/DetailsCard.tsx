import { useTranslation } from "react-i18next";
import { Card, HorizontalDivider } from "../ui";
import DownArrow from "../ui/DownArrow";
import DetailSection from "./DetailSection";
import type { ReactNode } from "react";
import { useState } from "react";
import { useDrawer, type FormField } from "../../contexts/DrawerContext";
import EditButton from "../ui/EditButton";
import { useAuth } from "../../contexts";

interface Detail {
  label: string;
  value: string;
  id: string;
}

interface DetailsCardProps {
  title?: string;
  details?: Detail[];
  editButtonText?: string;
  onEdit?: () => void;
  className?: string;
  variant?: "light" | "dark";
  children?: ReactNode;
  showEditButton?: boolean;
  collapsibleOnMobile?: boolean;
  enableEditDrawer?: boolean;
  onEditPerson?: (id: string) => void;
}

export default function DetailsCard({
  title,
  details,
  editButtonText,
  onEdit,
  className = "",
  variant = "light",
  children,
  showEditButton = true,
  collapsibleOnMobile = false,
  enableEditDrawer = false,
  onEditPerson,
}: DetailsCardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.user_type === "1";
  const { openDrawer } = useDrawer();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    if (onEditPerson) {
      onEditPerson(details?.[0]?.id || "");
    } else if (enableEditDrawer && details && title) {
      // Convert details to form fields
      const formFields: FormField[] = details.map((detail) => ({
        name: detail.label.toLowerCase().replace(/\s+/g, "_"),
        label: detail.label,
        type: "text",
        value: detail.value === "--" ? "" : detail.value,
      }));

      openDrawer(`Edit ${title}`, formFields);
    }
  };
  const handleAddBusiness = () => {
    if (enableEditDrawer && details && title) {
      const formFields: FormField[] = [
        { name: "person_id", label: "Person ID", type: "text", value: "" },
        {
          name: "business_name",
          label: "Business Name",
          type: "text",
          value: "",
        },
        {
          name: "business_category",
          label: "Business Category",
          type: "text",
          value: "",
        },
        { name: "address_1", label: "Address 1", type: "text", value: "" },
        { name: "address_2", label: "Address 2", type: "text", value: "" },
        { name: "city", label: "City", type: "text", value: "" },
        { name: "state", label: "State", type: "text", value: "" },
        { name: "country", label: "Country", type: "text", value: "" },
        { name: "pincode", label: "Pincode", type: "text", value: "" },
        { name: "email", label: "Email", type: "text", value: "" },
        { name: "phone", label: "Phone", type: "text", value: "" },
        { name: "whatsapp", label: "WhatsApp", type: "text", value: "" },
        { name: "website", label: "Website", type: "text", value: "" },
        { name: "instagram", label: "Instagram", type: "text", value: "" },
        { name: "facebook", label: "Facebook", type: "text", value: "" },
      ];
      openDrawer(`Add Business`, formFields);
    }
    console.log("Add Business button clicked");
    // Implement the logic for adding a business
  };

  return (
    <Card variant={variant} className={`w-full h-full ${className}`}>
      <div className="flex flex-col gap-3 p-1 md:p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          {title && (
            <h2
              className={`text-heading-6 ${
                variant === "light" ? "text-primary-600" : "text-primary-300"
              }`}
            >
              {title}
            </h2>
          )}
          {isAdmin && (
            <div className="flex items-center gap-3">
              {showEditButton && (
                // <button
                //   className="text-link-button text-text-link-blue hover:opacity-80 transition-opacity"
                //   onClick={handleEdit}
                // >
                //   {editButtonText || t("dashboard.profile.buttons.editDetails")}
                // </button>
                <>
                  {title !== "Business Information" ? (
                    <EditButton onClick={handleEdit}>
                      {editButtonText ||
                        t("dashboard.profile.buttons.editDetails")}
                    </EditButton>
                  ) : details?.[0]?.id !== "-" ? (
                    <EditButton onClick={handleEdit}>
                      {editButtonText ||
                        t("dashboard.profile.buttons.editDetails")}
                    </EditButton>
                  ) : (
                    <EditButton onClick={handleAddBusiness}>
                      {t("dashboard.profile.buttons.addDetails")}
                    </EditButton>
                  )}
                </>
              )}
              {/* Mobile collapse button */}
              {/* {collapsibleOnMobile && title && (
              <button
                className="md:hidden w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-all duration-200"
                onClick={toggleExpansion}
                aria-label={isExpanded ? "Collapse card" : "Expand card"}
              >
                <DownArrow
                  className={`transform transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  color="var(--primary-600)"
                />
              </button>
            )} */}
            </div>
          )}
        </div>

        {title && (
          <div className="w-full">
            <HorizontalDivider className="" />
          </div>
        )}

        {/* Details or Children */}
        <div
          className={`xl:py-2 transition-all duration-300 ease-in-out overflow-auto ${
            collapsibleOnMobile
              ? `md:h-auto ${isExpanded ? "h-auto" : "md:block"} ${
                  !isExpanded ? "details-card-collapsed" : ""
                }`
              : ""
          }`}
          data-variant={variant}
        >
          {children
            ? children
            : details && (
                <DetailSection details={details} onEditClick={onEditPerson} />
              )}
        </div>
      </div>
    </Card>
  );
}
