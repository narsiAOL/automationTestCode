import type { BusinessDirectoryItem } from "../../hooks/useBusinessDirectory";

interface BusinessCardProps {
  business: BusinessDirectoryItem;
  onClick?: (business: BusinessDirectoryItem) => void;
}

interface DetailRowProps {
  label: string;
  value: string | null | undefined;
}

function DetailRow({ label, value }: DetailRowProps) {
  if (!value) return null;

  return (
    <div className="flex gap-2 items-start w-full">
      {/* Label */}
      <p className="text-business-info font-medium shrink-0 w-[100px] min-w-[100px]">
        {label}
      </p>

      {/* Colon */}
      <p className="text-business-info font-medium shrink-0">:</p>

      {/* Value */}
      <p className="text-business-info font-semibold flex-1 min-w-0 break-words">
        {value}
      </p>
    </div>
  );
}

export default function BusinessCard({ business, onClick }: BusinessCardProps) {
  return (
    <div
      className="w-full cursor-pointer transition-colors hover:bg-primary-100/10"
      onClick={() => onClick?.(business)}
    >
      {/* Row border top */}
      <div className="bg-border-table h-[1.6px] w-full" />

      <div className="flex items-start w-full">
        {/* Left border */}
        <div className="bg-border-table self-stretch w-[1.2px] shrink-0" />

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2 px-4 py-3 min-w-0">
          {/* Detail rows */}
          <div className="flex flex-col gap-1.5">
            <DetailRow label="Page No." value={business.page_number?.toString()} />
            <DetailRow label="Name" value={business.business_name} />
            <DetailRow label="Kutumbh No." value={business.kutumb_number?.toString()} />
            <DetailRow label="Category" value={business.business_category} />
            <DetailRow label="Address" value={business.full_address} />
            <DetailRow label="Email" value={business.business_email} />
            <DetailRow label="Contact No." value={business.business_phone} />
            <DetailRow label="Website" value={business.business_website} />
            <DetailRow label="Instagram" value={business.business_instagram} />
            <DetailRow label="Facebook" value={business.business_facebook} />
          </div>
        </div>

        {/* Right border */}
        <div className="bg-border-table self-stretch w-[1.2px] shrink-0" />
      </div>
    </div>
  );
}
