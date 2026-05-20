import { useMemo } from "react";
import { usePeople } from "../../hooks/usePeople";
import { dummyMembersData } from "../../data/membersData";

import MembersIcon from "../../assets/svgs/members-icon.svg";
import FamilyIcon from "../../assets/svgs/family-icon.svg";
import CountryIcon from "../../assets/svgs/country-icon.svg";
import MarriedIcon from "../../assets/svgs/married-icon.svg";
import { useDashboard } from "../../hooks/useDashborad";

interface StatCard {
  id: string;
  label: string;
  value: number | string;
  icon: string; // SVG path
}

export default function StatsCards() {
  const { people } = usePeople({
    page: 1,
    limit: 100,
    sort: "kutumb_number",
    sortBy: "asc",
  });
  const { dashboardInfo } = useDashboard();

  const members = people
    ? (people as Array<Record<string, any>>)
    : dummyMembersData.members;

  const stats = useMemo<StatCard[]>(() => {
    return [
      {
        id: "total-members",
        label: "Total Members",
        value: dashboardInfo?.totalMembers || 0,
        icon: MembersIcon,
      },
      {
        id: "family-groups",
        label: "Family Groups",
        value: dashboardInfo?.familyGroups || 0,
        icon: FamilyIcon,
      },
      {
        id: "countries",
        label: "Countries",
        value: dashboardInfo?.countryCount || 0,
        icon: CountryIcon,
      },
      {
        id: "married",
        label: "Married Couples",
        value: dashboardInfo?.coupleCount || 0,
        icon: MarriedIcon,
      },
    ];
  }, [dashboardInfo]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card) => (
          <div
            key={card.id}
            className="bg-[#EBE0C5] border border-[#BC9C2F] rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] min-h-[148px]"
          >
            {/* Icon */}
            <div className="mb-2 opacity-80 w-12 h-12">
              <img
                src={card.icon}
                alt={card.label}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Value */}
            <div className="text-4xl font-serif font-bold text-[#3b2008] leading-none tracking-tight">
              {String(card.value).padStart(2, "0")}
            </div>

            {/* Label */}
            <div className="mt-1.5 font-serif text-[#7a5c2e]">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
