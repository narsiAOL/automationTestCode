import { Card, BusinessProfileFrame, HorizontalDivider } from "../../ui";
import DetailSection from "../DetailSection";
import { dummyBusinessInfoData } from "../../../data";
import { useTranslation } from "react-i18next";
import EditButton from "../../ui/EditButton";
import WebsitesCard from "./WebsitesCard";
import { useAuth } from "../../../contexts";

interface BusinessDetailsFormProps {
  businessInfo?: any;
  businessDetails?: any;
  profileImageAlt?: string;
  onEditBusiness: () => void;
}

export default function BusinessDetailsForm({
  businessInfo,
  businessDetails,
  profileImageAlt = "Business Profile Picture",
  onEditBusiness,
}: BusinessDetailsFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.user_type === "1";

  const businessData = businessInfo;
  return (
    <div className="personal-details-container">
      <Card variant="light" className="personal-details-card">
        {/* Top row: profile image + details side by side */}
        <div className="personal-details-inner pb-[15px]">
          {/* Profile Image */}
          <div className="personal-details-profile">
            <BusinessProfileFrame
              src={businessData?.photo}
              alt={profileImageAlt}
              className="w-full h-auto"
            />
          </div>

          {/* Details */}
          <div className="personal-details-content">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 className="text-heading-6 text-primary-600">
                {t("dashboard.profile.businessCard.title")}
              </h2>
              {isAdmin && (
                <EditButton onClick={onEditBusiness}>
                  {t("dashboard.profile.businessCard.editButton")}
                </EditButton>
              )}
            </div>

            <HorizontalDivider className="hidden md:block mb-4" />

            <div className="flex flex-col gap-3 py-2 w-full">
              <DetailSection details={businessData} />
            </div>
          </div>
        </div>

        {/* Bottom row: social cards — full width, below both columns */}
        {businessDetails && (
          <>
            {/* <HorizontalDivider className="my-4" /> */}
            <WebsitesCard businessDetails={businessDetails} />
          </>
        )}
      </Card>
    </div>
  );
}
