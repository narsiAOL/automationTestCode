import { Card, HorizontalDivider } from "../../ui";
import DetailSection from "../DetailSection";

interface PersonalDetail {
  id: string;
  label: string;
  value: string;
}

interface FamilyDetailsCardProps {
  familyData?: {
    grandfather?: string;
    grandmother?: string;
    father?: string;
    mother?: string;
  };
}

export default function FamilyDetailsCard({
  familyData = {
    grandfather: "Jamandasbhai Ramjidasbhai Shah",
    grandmother: "Rambhaben Jamandas Shah",
    father: "Arvind Jamandasbhai Shah",
    mother: "Smita Arvind Shah",
  },
}: FamilyDetailsCardProps) {
  const familyDetails: PersonalDetail[] = [
    {
      id: "grandfather",
      label: "Grandfather",
      value: familyData.grandfather || "--",
    },
    {
      id: "grandmother",
      label: "Grandmother",
      value: familyData.grandmother || "--",
    },
    { id: "father", label: "Father", value: familyData.father || "--" },
    { id: "mother", label: "Mother", value: familyData.mother || "--" },
  ];

  return (
    <Card variant="light" className="w-full h-full">
      <div className="flex flex-col gap-3 p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-6 text-primary-600">Family Details</h2>
          <button className="text-link-button text-text-link-blue hover:opacity-80 transition-opacity">
            Edit
          </button>
        </div>

        <HorizontalDivider className="mb-3" />

        {/* Family Info */}
        <div className="py-2">
          <DetailSection details={familyDetails} />
        </div>
      </div>
    </Card>
  );
}
