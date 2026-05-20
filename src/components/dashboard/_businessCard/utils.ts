import { useTranslation } from "react-i18next";

export interface WebsiteData {
  label: string;
  value: string;
}

export function extractWebsiteData(
  businessDetails: any,
  t: ReturnType<typeof useTranslation>["t"],
): WebsiteData[] {
  const websites: WebsiteData[] = [];

  // Always show website field
  websites.push({
    label: t("dashboard.profile.businessCard.websites.website"),
    value: businessDetails?.website || "-",
  });

  // Always show Instagram field
  websites.push({
    label: t("dashboard.profile.businessCard.websites.instagram"),
    value: businessDetails?.instagram || "-",
  });

  // Always show Twitter field
  // websites.push({
  //   label: t("dashboard.profile.businessCard.websites.twitter"),
  //   value: businessDetails?.twitter || "-",
  // });

  // Always show Facebook field
  websites.push({
    label: t("dashboard.profile.businessCard.websites.facebook"),
    value: businessDetails?.facebook || "-",
  });

  return websites;
}
