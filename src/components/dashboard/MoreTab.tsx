import { useTranslation } from "react-i18next";

export default function MoreTab() {
  const { t } = useTranslation();

  return (
    <div className="tab-content-wrapper">
      <h2 className="text-heading-4 text-text-main mb-4">
        {t("dashboard.tabs.more")}
      </h2>
      <p className="text-body-1 text-text-labels">
        More options content will be implemented here.
      </p>
    </div>
  );
}
