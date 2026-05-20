import DetailsCard from "../DetailsCard";

export default function AdsCard() {
  const handleEdit = () => {
    // Handle edit functionality
    console.log("Edit ads details");
  };

  return (
    <DetailsCard
      editButtonText=""
      onEdit={handleEdit}
      variant="dark"
      className="ads-card"
      showEditButton={false}
    >
      <div className="flex items-center justify-center w-full h-full min-h-[120px]">
        <p className="text-primary-300 text-heading-6">ADS</p>
      </div>
    </DetailsCard>
  );
}
