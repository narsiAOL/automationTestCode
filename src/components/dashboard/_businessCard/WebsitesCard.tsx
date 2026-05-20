// import DetailsCard from "../DetailsCard";
// import { useTranslation } from "react-i18next";
// import { extractWebsiteData } from "./utils";

// interface WebsitesCardProps {
//   businessDetails?: any;
// }

// export default function WebsitesCard({ businessDetails }: WebsitesCardProps) {
//   const { t } = useTranslation();

//   const websiteDetails = businessDetails
//     ? extractWebsiteData(businessDetails, t)
//     : [

//         {
//           label: t("dashboard.profile.businessCard.websites.website"),
//           value: "-",
//         },
//         {
//           label: t("dashboard.profile.businessCard.websites.instagram"),
//           value: "-",
//         },
//         {
//           label: t("dashboard.profile.businessCard.websites.twitter"),
//           value: "-",
//         },
//         {
//           label: t("dashboard.profile.businessCard.websites.facebook"),
//           value: "-",
//         },
//       ];

//   const handleEdit = () => {

//     console.log("Edit websites details");
//   };

//   return (
//     <DetailsCard
//       title={t("dashboard.profile.businessCard.websites.title")}
//       details={websiteDetails}
//       editButtonText={t("dashboard.profile.businessCard.websites.editButton")}
//       onEdit={handleEdit}
//       variant="light"
//       className="websites-card"
//     />
//   );
// }

import { useTranslation } from "react-i18next";
import { extractWebsiteData } from "./utils";
import InstaIcon from "../../../assets/svgs/insta.svg";
import TwitterIcon from "../../../assets/svgs/twitter.svg";
import FacebookIcon from "../../../assets/svgs/facebook.svg";
import WebsiteIcon from "../../../assets/svgs/website.svg";

interface WebsitesCardProps {
  businessDetails?: any;
}

function getPlatformIcon(label: string): string {
  const key = label.toLowerCase();
  if (key.includes("instagram")) return InstaIcon;
  if (key.includes("twitter") || key.includes("x.com") || key.includes("x "))
    return TwitterIcon;
  if (key.includes("facebook")) return FacebookIcon;
  return WebsiteIcon;
}

export default function WebsitesCard({ businessDetails }: WebsitesCardProps) {
  const { t } = useTranslation();

  const websiteDetails = businessDetails
    ? extractWebsiteData(businessDetails, t)
    : [
        {
          label: t("dashboard.profile.businessCard.websites.website"),
          value: "-",
        },
        {
          label: t("dashboard.profile.businessCard.websites.instagram"),
          value: "-",
        },
        // { label: t("dashboard.profile.businessCard.websites.twitter"), value: "-" },
        {
          label: t("dashboard.profile.businessCard.websites.facebook"),
          value: "-",
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[11.61px]">
      {websiteDetails.map((link) => (
        <div
          key={link.label}
          style={{
            height: "77.42px",
            borderRadius: "7.74px",
            border: "0.97px solid #DAD1BC",
            padding: "11.61px",
            gap: "11.61px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          {/* Icon box */}
          <div
            style={{
              width: "54.19px",
              height: "54.19px",
              borderRadius: "9px",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={getPlatformIcon(link.label)}
              alt={link.label}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <span className="text-icon-label">{link.label}</span>
            <span
              className={`
                text-icon-value
                whitespace-nowrap overflow-hidden text-ellipsis
                ${link.value === "-" || link.value === "--" ? "text-gray-400" : ""}
              `}
            >
              {link.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
