import Loader from "../ui/Loader";
import { BusinessDetailsForm } from "./_businessCard";
import { getBusinessDetailsData } from "./_profile/profileCardData";
import { useTranslation } from "react-i18next";

export default function BusinessCardTab({
  business_details,
  loading,
  error,
  onEditBusiness,
}: {
  business_details?: any;
  loading: boolean;
  error: string | null;
  onEditBusiness: () => void;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader
          message={t("dashboard.profile.businessCard.loading")}
          containerClassName="mt-12"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px] text-red-500">
        Error loading business details: {error}
      </div>
    );
  }

  if (!business_details || business_details.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        {t("dashboard.profile.businessCard.noBusiness")}
      </div>
    );
  }

  return (
    <div className="tab-content-wrapper">
      <BusinessDetailsForm
        businessInfo={getBusinessDetailsData(business_details[0], t)}
        businessDetails={business_details[0]}
        onEditBusiness={onEditBusiness}
      />
    </div>
  );
}
