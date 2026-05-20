import DetailItem from "./DetailItem";

interface PersonalDetail {
  label: string;
  value: string;
  id: string;
}

interface DetailSectionProps {
  details: PersonalDetail[];
  isRightColumn?: boolean;
  onEditClick?: (id: string) => void;
}

export default function DetailSection({
  details,
  isRightColumn = false,
  onEditClick,
}: DetailSectionProps) {
  return (
    <div className="flex flex-col gap-3 lg:gap-1 xl:gap-3">
      {details.length === 0 ? (
        <div className="text-sm text-gray-500 flex justify-center items-center h-[150px] italic">
          No details available
        </div>
      ) : (
        details.map((detail, index) => (
          <DetailItem
            key={index}
            {...detail}
            isRightColumn={isRightColumn}
            isEdit={true}
            onEditClick={onEditClick}
          />
        ))
      )}
    </div>
  );
}
