import { useTranslation } from "react-i18next";
import Flower from "../../assets/svgs/ornamental-flower-icon.svg";

export default function OrnamentalFlower({
  className = "",
}: {
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <img src={Flower} alt={t("ui.imageAlt.flower")} className={className} />
  );
}
