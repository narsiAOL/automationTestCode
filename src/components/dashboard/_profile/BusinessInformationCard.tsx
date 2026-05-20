import { Card, HorizontalDivider } from "../../ui";
import OrnamentalDivider from "../../ui/OrnamentalDivider";

import DetailSection from "../DetailSection";

interface PersonalDetail {
  id: string;
  label: string;
  value: string;
}

interface BusinessInformationCardProps {
  businessData?: {
    name?: string;
    address?: string;
    email?: string;
    mobileNo?: string;
    whatsappNo?: string;
  };
}

export default function BusinessInformationCard({
  businessData = {
    name: "Enterpi Tech Solutions",
    address:
      "14th Floor, C5, Orbit by Auro Realty, Knowledge City Rd, Silpa Gram Craft Village, Rai Durg, Hyderabad, Telangana 500019",
    email: "p.shah@gmail.com",
    mobileNo: "+91 02-2303-2030",
    whatsappNo: "+91 02-2303-2030",
  },
}: BusinessInformationCardProps) {
  const businessDetails: PersonalDetail[] = [
    { id: "name", label: "Name", value: businessData.name || "--" },
    { id: "address", label: "Address", value: businessData.address || "--" },
    { id: "email", label: "Email", value: businessData.email || "--" },
    {
      id: "mobileNo",
      label: "Mobile no.",
      value: businessData.mobileNo || "--",
    },
    {
      id: "whatsappNo",
      label: "Whatsapp no.",
      value: businessData.whatsappNo || "--",
    },
  ];

  return (
    <Card variant="light" className="w-full h-full">
      <div className="flex flex-col gap-3 p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-6 text-primary-600">
            Business Information
          </h2>
          <button className="text-link-button text-text-link-blue hover:opacity-80 transition-opacity">
            Edit
          </button>
        </div>

        <HorizontalDivider className="mb-3" />

        {/* Business Info */}
        <div className="py-2">
          <DetailSection details={businessDetails} />
        </div>
      </div>
    </Card>
  );
}
