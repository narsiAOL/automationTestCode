import { Card, HorizontalDivider } from "../../ui";
import DetailSection from "../DetailSection";

interface PersonalDetail {
  id: string;
  label: string;
  value: string;
}

interface SiblingsDetailsCardProps {
  siblingsData?: {
    elderBrother1?: string;
    elderBrother2?: string;
    elderBrother3?: string;
    elderSister?: string;
    youngerSister?: string;
  };
}

export default function SiblingDetailsCard({
  siblingsData = {
    elderBrother1: "Rashik Arvind Shah",
    elderBrother2: "Pravin Arvind Shah",
    elderBrother3: "Dr. Pritam Arvind Shah",
    elderSister: "Ganga Ramesh Shah",
    youngerSister: "Jamuna Arvind Shah",
  },
}: SiblingsDetailsCardProps) {
  const siblingsDetails: PersonalDetail[] = [
    {
      id: "elderBrother1",
      label: "Elder Brother",
      value: siblingsData.elderBrother1 || "--",
    },
    {
      id: "elderBrother2",
      label: "Elder Brother",
      value: siblingsData.elderBrother2 || "--",
    },
    {
      id: "elderBrother3",
      label: "Elder Brother",
      value: siblingsData.elderBrother3 || "--",
    },
    {
      id: "elderSister",
      label: "Elder sister",
      value: siblingsData.elderSister || "--",
    },
    {
      id: "youngerSister",
      label: "Younger sister",
      value: siblingsData.youngerSister || "--",
    },
  ];

  return (
    <Card variant="light" className="w-full h-full">
      <div className="flex flex-col gap-3 p-6 h-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-6 text-primary-600">Siblings</h2>
          <button className="text-link-button text-text-link-blue hover:opacity-80 transition-opacity">
            Edit
          </button>
        </div>

        <HorizontalDivider className="mb-3" />

        {/* Siblings Info */}
        <div className="py-2">
          <DetailSection details={siblingsDetails} />
        </div>
      </div>
    </Card>
  );
}
