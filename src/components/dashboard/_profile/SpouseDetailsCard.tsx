import { Card, HorizontalDivider, Divider } from "../../ui";
import SimpleDivider from "../../ui/SimpleDivider";
import DetailSection from "../DetailSection";
import { formatDateWithFallback } from "../../../utils/dateUtils";
import { useDrawer, type FormField } from "../../../contexts/DrawerContext";
import { useTranslation } from "react-i18next";

interface PersonalDetail {
  id: string;
  label: string;
  value: string;
}

interface SpouseDetailsCardProps {
  spouseData?: {
    fullName?: string;
    fatherName?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    community?: string;
    emailId?: string;
    mobileNo?: string;
    whatsappNo?: string;
    kutumbhNo?: string;
    pageNo?: string;
  };
}

export default function SpouseDetailsCard({
  spouseData = {
    fullName: "Jaishree Pankaj Shah",
    fatherName: "Chagan Hasmukh Shah",
    dateOfBirth: "17/04/1946",
    bloodGroup: "O+",
    community: "--",
    emailId: "p.shah@gmail.com",
    mobileNo: "+91 02-2303-2030",
    whatsappNo: "+91 02-2303-2030",
    kutumbhNo: "1234567",
    pageNo: "29",
  },
}: SpouseDetailsCardProps) {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();

  const handleEditSpouse = () => {
    const formFields: FormField[] = [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        value: spouseData.fullName || "",
        required: true,
      },
      {
        name: "fatherName",
        label: "Father's Name",
        type: "text",
        value: spouseData.fatherName || "",
      },
      {
        name: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
        value: spouseData.dateOfBirth || "",
      },
      {
        name: "bloodGroup",
        label: "Blood Group",
        type: "select",
        value: spouseData.bloodGroup || "",
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
        name: "community",
        label: "Community",
        type: "text",
        value: spouseData.community === "--" ? "" : spouseData.community || "",
      },
      {
        name: "emailId",
        label: "Email Id",
        type: "email",
        value: spouseData.emailId || "",
      },
      {
        name: "mobileNo",
        label: "Mobile no.",
        type: "tel",
        value: spouseData.mobileNo || "",
      },
      {
        name: "whatsappNo",
        label: "Whatsapp no.",
        type: "tel",
        value: spouseData.whatsappNo || "",
      },
      {
        name: "kutumbhNo",
        label: "Kutumbh No",
        type: "text",
        value: spouseData.kutumbhNo || "",
      },
      {
        name: "pageNo",
        label: "Page No",
        type: "text",
        value: spouseData.pageNo || "",
      },
    ];

    openDrawer("Edit Spouse Details", formFields);
  };
  const leftColumnDetails: PersonalDetail[] = [
    { id: "fullName", label: "Full Name", value: spouseData.fullName || "--" },
    {
      id: "fatherName",
      label: "Father's Name",
      value: spouseData.fatherName || "--",
    },
    {
      id: "dateOfBirth",
      label: "Date of Birth",
      value: formatDateWithFallback(spouseData.dateOfBirth, "--"),
    },
    {
      id: "bloodGroup",
      label: "Blood Group",
      value: spouseData.bloodGroup || "--",
    },
    {
      id: "community",
      label: "Community",
      value: spouseData.community || "--",
    },
  ];

  const rightColumnContactDetails: PersonalDetail[] = [
    { id: "emailId", label: "Email Id", value: spouseData.emailId || "--" },
    { id: "mobileNo", label: "Mobile no.", value: spouseData.mobileNo || "--" },
    {
      id: "whatsappNo",
      label: "Whatsapp no.",
      value: spouseData.whatsappNo || "--",
    },
  ];

  const rightColumnKutumbhDetails: PersonalDetail[] = [
    {
      id: "kutumbhNo",
      label: "Kutumbh No",
      value: spouseData.kutumbhNo || "--",
    },
    { id: "pageNo", label: "Page No", value: spouseData.pageNo || "--" },
  ];

  return (
    <Card variant="light" className="w-full">
      <div className="flex flex-col gap-3 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-6 text-primary-600">Spouse Details</h2>
          <button
            className="text-link-button text-text-link-blue hover:opacity-80 transition-opacity"
            onClick={handleEditSpouse}
          >
            Edit
          </button>
        </div>

        <HorizontalDivider className="mb-3" />

        {/* Details Grid */}
        <div className="flex gap-5 py-2 w-full h-fit">
          {/* Left Column */}
          <div className="flex flex-col gap-6 pr-5 flex-1">
            <DetailSection details={leftColumnDetails} />
          </div>

          {/* Vertical Divider */}
          {/* <div className="flex justify-center h-60">
            <Divider color="dark" size="large" />
          </div> */}

          <div className="hidden md:flex items-stretch justify-center">
            <div className="w-px bg-border-light h-full opacity-50"></div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5 flex-1 pl-6 py-2">
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
      </div>
    </Card>
  );
}
