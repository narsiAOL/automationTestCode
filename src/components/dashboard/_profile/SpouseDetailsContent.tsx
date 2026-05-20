import { HorizontalDivider, Divider } from "../../ui";
import SimpleDivider from "../../ui/SimpleDivider";
import DetailSection from "../DetailSection";
import { dummyProfileData, getValueOrFallback } from "../../../data";
import type { ProfileDetails } from "../../../hooks/useProfile";
import { useTranslation } from "react-i18next";
import { formatDateWithFallback } from "../../../utils/dateUtils";

interface PersonalDetail {
  label: string;
  value: string;
  id: string;
}

export default function SpouseDetailsContent({ profile }: any) {
  const { t } = useTranslation();
  // Get spouse data from dummy API response
  const spouseData = profile.spouse_details;
  const personalData = profile.personal_details;

  const leftColumnDetails: PersonalDetail[] = [
    {
      label: t("dashboard.profile.spouseDetails.fullName"),
      value: getValueOrFallback(spouseData?.spouse_name),
      id: getValueOrFallback(spouseData?.spouse_id),
    },
    {
      label: t("dashboard.profile.spouseDetails.fatherName"),
      value: getValueOrFallback(spouseData?.spouse_father_name),
      id: "-",
    },
    {
      label: t("dashboard.profile.spouseDetails.dateOfBirth"),
      value: formatDateWithFallback(spouseData?.spouse_dob),
      id: "-",
    },
    {
      label: t("dashboard.profile.spouseDetails.bloodGroup"),
      value: getValueOrFallback(spouseData?.spouse_blood_group),
      id: "-",
    },
    {
      label: t("dashboard.profile.spouseDetails.gotra"),
      value: getValueOrFallback(spouseData?.spouse_gotra),
      id: "-",
    },
  ];

  const rightColumnContactDetails: PersonalDetail[] = [
    {
      label: t("dashboard.profile.spouseDetails.email"),
      value: getValueOrFallback(spouseData?.email),
      id: "-",
    },
    {
      label: t("dashboard.profile.spouseDetails.mobile"),
      value: getValueOrFallback(spouseData?.mobile),
      id: "-",
    },
    {
      label: t("dashboard.profile.spouseDetails.whatsapp"),
      value: getValueOrFallback(spouseData?.whatsapp),
      id: "-",
    },
  ];

  const rightColumnKutumbhDetails: PersonalDetail[] = [
    {
      label: t("dashboard.profile.spouseDetails.kutumbhNo"),
      value: getValueOrFallback(personalData?.kutumb_number),
      id: "-",
    },
    {
      label: t("dashboard.profile.spouseDetails.pageNo"),
      value: getValueOrFallback(personalData?.page_number),
      id: "-",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row lg:gap-1 xl:gap-5 py-2 w-full h-fit">
      {/* Left Column */}
      <div className="flex flex-col gap-6 md:pr-5 flex-1">
        <DetailSection details={leftColumnDetails} />
      </div>

      {/* Vertical Divider - Hidden on mobile */}
      {/* <div className="hidden md:flex justify-center h-60">
        <Divider color="dark" size="large" />
      </div> */}

      <div className="hidden md:flex items-stretch justify-center">
        <div className="w-px bg-border-light h-full opacity-60"></div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-5 flex-1 md:pl-6 py-2">
        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <DetailSection
            details={rightColumnContactDetails}
            isRightColumn={true}
          />
        </div>

        <SimpleDivider className="hidden md:block" />

        {/* Kutumbh Info */}
        <div className="flex flex-col gap-3">
          <DetailSection
            details={rightColumnKutumbhDetails}
            isRightColumn={true}
          />
        </div>
      </div>
    </div>
  );
}
