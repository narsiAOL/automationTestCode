import { useTranslation } from "react-i18next";
import GreenRightArrow from "../../assets/svgs/right-vectorized-arrow.svg";

export default function GreenRightArrowIcon({
  className = "",
}: {
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <img
      src={GreenRightArrow}
      alt={t("ui.imageAlt.greenRightArrow")}
      className={className}
    />
  );
}