import { useTranslation } from "react-i18next";
import GreenLeftArrow from "../../assets/svgs/left-vectorized-arrow.svg";

export default function GreenLeftArrowIcon({
  className = "",
}: {
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <img
      src={GreenLeftArrow}
      alt={t("ui.imageAlt.greenLeftArrow")}
      className={className}
    />
  );
}