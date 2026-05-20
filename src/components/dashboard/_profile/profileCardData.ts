// Data configurations for profile cards
import { dummyProfileData, getValueOrFallback } from "../../../data";

export interface PersonalDetail {
  label: string;
  value: string;
}

// Family Details Data
export const getFamilyDetailsData = (
  familyData?: any,
  t?: (key: string) => string,
) => {
  familyData = familyData ?? dummyProfileData.family_details;

  return [
    {
      label: t
        ? t("dashboard.profile.familyLabels.grandfather")
        : "Grandfather",
      value: getValueOrFallback(familyData.grandfather_name),
      id: getValueOrFallback(familyData.grandfather_id),
    },
    {
      label: t
        ? t("dashboard.profile.familyLabels.grandmother")
        : "Grandmother",
      value: getValueOrFallback(familyData.grandmother_name),
      id: getValueOrFallback(familyData.grandmother_id),
    },
    {
      label: t ? t("dashboard.profile.familyLabels.father") : "Father",
      value: getValueOrFallback(familyData.father_name),
      id: getValueOrFallback(familyData.father_id),
    },
    {
      label: t ? t("dashboard.profile.familyLabels.mother") : "Mother",
      value: getValueOrFallback(familyData.mother_name),
      id: getValueOrFallback(familyData.mother_id),
    },
  ];
};

// Children Details Data
export const getChildrenDetailsData = (
  children_data?: any,
  t?: (key: string) => string,
) => {
  const childrenData = children_data ?? [];

  const mapChildren = (role: string, label: string) =>
    childrenData
      .filter((c: any) => c.role === role)
      .map((child: any) => ({
        label,
        value: getValueOrFallback(child.full_name),
        id: getValueOrFallback(child.child_id || child.id),
      }));

  return [
    ...mapChildren(
      "elder_daughter",
      t ? t("dashboard.profile.childrenLabels.elderDaughter") : "Daughter",
    ),
    ...mapChildren(
      "younger_daughter",
      t ? t("dashboard.profile.childrenLabels.youngerDaughter") : "Daughter",
    ),
    ...mapChildren(
      "elder_son",
      t ? t("dashboard.profile.childrenLabels.elderSon") : "Son",
    ),
    ...mapChildren(
      "younger_son",
      t ? t("dashboard.profile.childrenLabels.youngerSon") : "Son",
    ),
  ];
};

// Sibling Details Data
export const getSiblingDetailsData = (
  siblings_data?: any,
  t?: (key: string) => string,
) => {
  const siblingData = siblings_data ?? dummyProfileData.siblings_details;

  // Helper to map siblings by role
  const mapSiblings = (role: string, label: string) =>
    siblingData
      .filter((s) => s.role === role)
      .map((s) => ({
        label,
        value: getValueOrFallback(s.full_name),
        id: getValueOrFallback(s.sibling_id || s.id),
      }));

  return [
    ...mapSiblings(
      "elder_brother",
      t ? t("dashboard.profile.siblingsLabels.elderBrother") : "Brother",
    ),
    ...mapSiblings(
      "elder_sister",
      t ? t("dashboard.profile.siblingsLabels.elderSister") : "Sister",
    ),
    ...mapSiblings(
      "younger_brother",
      t ? t("dashboard.profile.siblingsLabels.youngerBrother") : "Brother",
    ),
    ...mapSiblings(
      "younger_sister",
      t ? t("dashboard.profile.siblingsLabels.youngerSister") : "Sister",
    ),
  ];
};

// Business Information Data
export const getBusinessDetailsData = (
  business_data?: any,
  t?: (key: string) => string,
) => {
  const businessData = business_data ?? dummyProfileData.business_details[0];

  if (!businessData) return [];

  return [
    {
      label: t ? t("dashboard.profile.businessLabels.name") : "Name",
      value: getValueOrFallback(
        businessData.business_name || businessData.name,
      ),
      id: getValueOrFallback(businessData.id),
    },
    {
      label: t ? t("dashboard.profile.businessLabels.address_1") : "Address 1",
      value: getValueOrFallback(
        businessData.address_1 ||
          `${businessData.address_1 ?? ""} ${businessData.address_2 ?? ""} ${
            businessData.city ?? ""
          }`,
      ),
      id: "-",
    },
    {
      label: t ? t("dashboard.profile.businessLabels.address_2") : "Address 2",
      value: getValueOrFallback(
        businessData.address_2 ||
          `${businessData.address_1 ?? ""} ${businessData.address_2 ?? ""} ${
            businessData.city ?? ""
          }`,
      ),
      id: "-",
    },
    {
      label: t ? t("dashboard.profile.businessLabels.email") : "Email",
      value: getValueOrFallback(businessData.email),
      id: "-",
    },
    {
      label: t ? t("dashboard.profile.businessLabels.mobile") : "Mobile no.",
      value: getValueOrFallback(businessData.phone),
      id: "-",
    },
    {
      label: t
        ? t("dashboard.profile.businessLabels.whatsapp")
        : "Whatsapp no.",
      value: getValueOrFallback(businessData.whatsapp),
      id: "-",
    },
    {
      label: t ? t("dashboard.profile.businessLabels.instagram") : "Instagram",
      value: getValueOrFallback(businessData.instagram),
      id: "-",
    },
    {
      label: t ? t("dashboard.profile.businessLabels.website") : "Website",
      value: getValueOrFallback(businessData.website),
      id: "-",
    },
  ];
};
//Spouse Details Data is handled separately in SpouseDetailsContent component due to its unique structure and display requirements.
// Spouse Details Data (split into left, right, kutumbh columns like UI)
export const getSpouseDetailsData = (
  spouseData?: any,

  t?: (key: string) => string,
) => {
  spouseData = spouseData ?? dummyProfileData.spouse_details;

  // Left column: full name, father name, dob, blood group, gotra
  const leftColumnDetails = [
    {
      label: t ? t("dashboard.profile.spouseDetails.fullName") : "Full Name",
      value: getValueOrFallback(spouseData.spouse_name),
      id: getValueOrFallback(spouseData.spouse_id),
    },
    {
      label: t
        ? t("dashboard.profile.spouseDetails.fatherName")
        : "Father Name",
      value: getValueOrFallback(spouseData?.spouse_father_name),
      id: getValueOrFallback(spouseData?.spouse_father_id),
    },
    {
      label: t
        ? t("dashboard.profile.spouseDetails.dateOfBirth")
        : "Date of Birth",
      value: getValueOrFallback(spouseData.spouse_dob),
      id: getValueOrFallback(spouseData.spouse_id),
    },
    {
      label: t
        ? t("dashboard.profile.spouseDetails.bloodGroup")
        : "Blood Group",
      value: getValueOrFallback(spouseData.spouse_blood_group),
      id: getValueOrFallback(spouseData.spouse_blood_group),
    },
    {
      label: t ? t("dashboard.profile.spouseDetails.gotra") : "Gotra",
      value: getValueOrFallback(spouseData.spouse_gothra),
      id: getValueOrFallback(spouseData.spouse_gothra),
    },
  ];

  // Right column: email, mobile, whatsapp
  const rightColumnContactDetails = [
    {
      label: t ? t("dashboard.profile.spouseDetails.email") : "Email",
      value: getValueOrFallback(spouseData.spouse_email),
      id: getValueOrFallback(spouseData.spouse_email),
    },
    {
      label: t ? t("dashboard.profile.spouseDetails.mobile") : "Mobile",
      value: getValueOrFallback(spouseData.spouse_phone),
      id: getValueOrFallback(spouseData.spouse_phone),
    },
    {
      label: t ? t("dashboard.profile.spouseDetails.whatsapp") : "Whatsapp",
      value: getValueOrFallback(spouseData.spouse_whatsapp),
      id: getValueOrFallback(spouseData.spouse_whatsapp),
    },
  ];

  // Right column: kutumbh details
  const rightColumnKutumbhDetails = [
    {
      label: t ? t("dashboard.profile.spouseDetails.kutumbhNo") : "Kutumbh No.",
      value: getValueOrFallback(spouseData.spouse_kutumb_number),
      id: getValueOrFallback(spouseData.spouse_kutumb_number),
    },
    {
      label: t ? t("dashboard.profile.spouseDetails.pageNo") : "Page No.",
      value: getValueOrFallback(spouseData.spouse_page_number),
      id: getValueOrFallback(spouseData.spouse_page_number),
    },
  ];

  return [
    ...leftColumnDetails,
    ...rightColumnContactDetails,
    ...rightColumnKutumbhDetails,
  ];
};
