// @ts-nocheck
import { useState } from "react";
import {
  Card,
  MainProfileFrame,
  Badge,
  HorizontalDivider,
  Divider,
  Button,
} from "../../ui";
// import DownArrow from "../../ui/DownArrow";
import SimpleDivider from "../../ui/SimpleDivider";
import DetailSection from "../DetailSection";
import { dummyProfileData, getValueOrFallback } from "../../../data";
import type { ProfileDetails } from "../../../hooks/useProfile";
import { useTranslation } from "react-i18next";
import { formatDateWithFallback } from "../../../utils/dateUtils";
import { useDrawer, type FormField } from "../../../contexts/DrawerContext";
import EditButton from "../../ui/EditButton";
import { useAuth } from "../../../contexts";

interface PersonalDetail {
  label: string;
  value: string;
}

interface PersonalDetailsFormProps {
  personalDetails?: ProfileDetails["personal_details"];
  profileImageSrc?: string;
  profileImageAlt?: string;
  maritalStatus?: string;
  handleEditProfile?: (id: string) => void;
  handleDeleteProfile?: (id: string) => void;
}

export default function PersonalDetailsForm({
  personalDetails,
  profileImageSrc,
  profileImageAlt = "Profile Picture",
  maritalStatus,
  handleEditProfile,
  handleDeleteProfile,
}: PersonalDetailsFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.user_type === "1";
  // const [isExpanded, setIsExpanded] = useState(false);

  // const toggleExpansion = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const resedentialAddress = personalDetails
    ? [
        personalDetails.street,
        personalDetails.city,
        personalDetails.state,
        personalDetails.postal_code,
        personalDetails.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";
  const profileImage = personalDetails?.photo || profileImageSrc || "";
  const profileData = personalDetails;

  // Sample data - this would typically come from props or context
  const leftColumnDetails: PersonalDetail[] = [
    {
      label: t("dashboard.profile.personalDetails.kutumbhNo"),
      value: getValueOrFallback(profileData.kutumb_number),
    },
    // {
    //   label: t("dashboard.profile.personalDetails.pageNo"),
    //   value: getValueOrFallback(profileData.page_number),
    // },
  ];

  const personalInfo: PersonalDetail[] = [
    {
      label: t("dashboard.profile.personalDetails.firstName"),
      value: getValueOrFallback(profileData.firstname),
    },
    {
      label: t("dashboard.profile.personalDetails.lastName"),
      value: getValueOrFallback(profileData.lastname ?? ""),
    },
    {
      label: t("dashboard.profile.personalDetails.surname"),
      value: getValueOrFallback(profileData.surname),
    },
    {
      label: t("dashboard.profile.personalDetails.gender"),
      value: getValueOrFallback(profileData.gender),
    },
    {
      label: t("dashboard.profile.personalDetails.dateOfBirth"),
      value: formatDateWithFallback(profileData.dob),
    },
    {
      label: t("dashboard.profile.personalDetails.placeOfBirth"),
      value: getValueOrFallback(profileData.pob),
    },
    {
      label: t("dashboard.profile.personalDetails.gotra"),
      value: getValueOrFallback(profileData.gothra),
    },
    {
      label: t("dashboard.profile.personalDetails.bloodGroup"),
      value: getValueOrFallback(profileData.blood_group),
    },
    {
      label: t("dashboard.profile.personalDetails.dateOfMarriage"),
      value: formatDateWithFallback(profileData.marriage_date),
    },
  ];

  const addressInfo: PersonalDetail[] = [
    {
      label: t("dashboard.profile.personalDetails.state"),
      value: getValueOrFallback(profileData.state),
    },
    {
      label: t("dashboard.profile.personalDetails.city"),
      value: getValueOrFallback(profileData.city),
    },
    {
      label: t("dashboard.profile.personalDetails.pincode"),
      value: getValueOrFallback(profileData.postal_code),
    },
    {
      label: t("dashboard.profile.personalDetails.country"),
      value: getValueOrFallback(profileData.country),
    },
    {
      label: t("dashboard.profile.personalDetails.residentialAddress"),
      value: getValueOrFallback(resedentialAddress),
    },
  ];

  const contactInfo: PersonalDetail[] = [
    {
      label: t("dashboard.profile.personalDetails.education"),
      value: getValueOrFallback(profileData.education),
    },
    {
      label: t("dashboard.profile.personalDetails.email"),
      value: getValueOrFallback(profileData.email),
    },
    {
      label: t("dashboard.profile.personalDetails.mobile"),
      value: getValueOrFallback(profileData.phone),
    },
    {
      label: t("dashboard.profile.personalDetails.whatsapp"),
      value: getValueOrFallback(profileData.whatsapp),
    },
  ];

  return (
    <div className="personal-details-container">
      <Card
        variant="light"
        className="personal-details-card"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <div className="personal-details-inner">
          {/* Profile Image - now inside the card */}
          {/* Profile Image - full height of card */}
          <div className="personal-details-profile">
            <MainProfileFrame
              src={profileData.photo}
              alt={profileImageAlt}
              className="w-full h-auto"
            />
          </div>

          {/* Details Section */}
          <div
            className="personal-details-content flex flex-col gap-3 p-1 md:p-6 h-full"
            style={{ padding: "1rem 1.25rem" }}
          >
            {/* Header */}
            <div className="flex flex-col gap-3 mb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <h2 className="text-heading-6 text-primary-600">
                    {t("dashboard.profile.personalDetails.title")}
                  </h2>
                  {profileData.maritalStatus && (
                    <Badge variant="default" className="w-fit">
                      {maritalStatus || profileData.maritalStatus}
                    </Badge>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-3">
                    <EditButton
                      //className="text-link-button text-text-link-blue hover:opacity-80 transition-opacity"
                      onClick={() =>
                        handleEditProfile && handleEditProfile(profileData.id)
                      }
                    >
                      {t("dashboard.profile.personalDetails.editButton")}
                    </EditButton>
                    {!personalDetails.is_deleted && (
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleDeleteProfile &&
                          handleDeleteProfile(profileData.id)
                        }
                      >
                        {t(
                          "dashboard.profile.personalDetails.deleteButton",
                          "Delete",
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal Divider */}
            <HorizontalDivider className="mb-3" />

            {/* Details Grid */}
            <div
              className="flex flex-col md:flex-row md:gap-5 py-2 w-full h-auto"
              data-variant="light"
            >
              <div className="flex flex-col md:gap-6 md:pr-5 w-full md:w-[40%]">
                <div className="flex flex-col gap-3">
                  <DetailSection details={leftColumnDetails} />
                </div>
                <SimpleDivider className="hidden md:block mx-auto my-3" />
                <div className="flex flex-col gap-3">
                  <DetailSection details={personalInfo} />
                </div>
              </div>

              {/* <div className="hidden md:flex items-center justify-center">
                <Divider color="dark" size="large" />
              </div> */}

              <div className="hidden md:flex items-stretch justify-center">
                <div className="w-px bg-border-light h-full opacity-50"></div>
              </div>

              <div className="flex flex-col md:gap-5 w-full md:w-[60%] md:pl-6 py-2">
                <div className="flex flex-col gap-3">
                  <DetailSection details={addressInfo} isRightColumn={true} />
                </div>
                <SimpleDivider className="hidden md:block my-3" />
                <div className="flex flex-col gap-3">
                  <DetailSection details={contactInfo} isRightColumn={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
