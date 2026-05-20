import { Card, HorizontalDivider } from "../../ui";
import DetailSection from "../DetailSection";

interface PersonalDetail {
  id: string;
  label: string;
  value: string;
}

interface ChildrenDetailsCardProps {
  childrenData?: {
    elderDaughter?: string;
    elderSon?: string;
    youngerSon?: string;
  };
}

export default function ChildrenDetailsCard({
  childrenData = {
    elderDaughter: "Preeti Sanjay Mehta",
    elderSon: "Pranav Pankaj Shah",
    youngerSon: "Parikshit Pankaj Shah",
  },
}: ChildrenDetailsCardProps) {
  const childrenDetails: PersonalDetail[] = [
    {
      id: "elderDaughter",
      label: "Elder Daughter",
      value: childrenData.elderDaughter || "--",
    },
    {
      id: "elderSon",
      label: "Elder Son",
      value: childrenData.elderSon || "--",
    },
    {
      id: "youngerSon",
      label: "Younger Son",
      value: childrenData.youngerSon || "--",
    },
  ];

  return (
    <Card variant="light" className="w-full h-full">
      <div className="flex flex-col gap-3 p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-6 text-primary-600">Children</h2>
          <button className="text-link-button text-text-link-blue hover:opacity-80 transition-opacity">
            Edit
          </button>
        </div>

        <HorizontalDivider className="mb-3" />

        {/* Children Info */}
        <div className="py-2">
          <DetailSection details={childrenDetails} />
        </div>
      </div>
    </Card>
  );
}
