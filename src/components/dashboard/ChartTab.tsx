import { useTranslation } from "react-i18next";
import FamilyTree from "./_chart/FamilyTree";
import { useAuth } from "../../contexts/AuthContext";
import type { ProfileDetails } from "../../hooks/useProfile";

export default function ChartTab({
  profile,
}: {
  profile?: ProfileDetails | null;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Use the current user's person_id for the family tree
  const personId = profile?.personal_details?.id || user?.person_id;

  return (
    <div className="mt-3 sm:mt-4 rounded-xl border border-[#e2d5bb] bg-[#faf7f0] p-0 sm:p-4 h-[80vh] overflow-auto">
      {personId ? (
        <div className="tab-content-wrapper max-w-8xl mx-auto">
          <FamilyTree personId={personId} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-600 mb-2">
              {t("No user profile found")}
            </div>
            <div className="text-sm text-gray-500">
              {t("Please ensure you are logged in to view your family tree")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
