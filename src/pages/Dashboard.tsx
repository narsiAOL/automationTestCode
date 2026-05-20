import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import StatsCards from "../components/dashboard/StatsCards";
import FamilyTree from "../components/dashboard/_chart/FamilyTree";
import {
  Button,
  EditDrawer,
  SearchBar,
  ViewModeToggle,
} from "../components/ui";
import { useDashboardState } from "../contexts/DashboardContext";
import { useAuth, useDrawer, type FormField } from "../contexts";
import { useProfile, useDownload, usePeople, useToast } from "../hooks";
import Loader from "../components/ui/Loader";
import { filtersService } from "../services/filters";
import type { SortKey } from "../components/ui/FunctionalButton";
import FormSelect from "../components/ui/FormSelect";
import { isAdmin } from "../utils/userUtils";
import EditButton from "../components/ui/EditButton";
import EditForm from "../components/dashboard/EditForm";
import peopleService from "../services/people";
import { useGetFamilies } from "../hooks/useGetFamilies";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAdminUser = isAdmin(user);
  const { selectedPersonId } = useDashboardState();
  const { loading, fetchProfile } = useProfile(
    selectedPersonId || user?.person_id || "",
  );
  const { families: familyGroups, loading: familiesLoading } = useGetFamilies();
  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawer();
  const { isDownloading, downloadProfilePdf } = useDownload();
  const { showSuccess, showError } = useToast();
  const [familySearch, setFamilySearch] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<any | null>(null);
  const [isMobileFamilyDropdownOpen, setIsMobileFamilyDropdownOpen] =
    useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("kutumb_number");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");
  const [filterBy, setFilterBy] = useState("");
  const [sortKeys, setSortKeys] = useState<SortKey[]>([]);
  const [filtersLoaded, setFiltersLoaded] = useState<boolean>(false);
  const mobileFamilyDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch filters on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filterData = await filtersService.getFilters("people");
        const extractedSortKeys = filtersService.extractSortKeys(filterData);
        setSortKeys(extractedSortKeys);

        // Set default sort to kutumb_number if available, otherwise first available
        const defaultSortKey =
          extractedSortKeys.find((key) => key.value === "kutumb_number") ||
          extractedSortKeys[0];
        if (defaultSortKey) {
          setSort(defaultSortKey.value);
        }
        setFiltersLoaded(true);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
        setFiltersLoaded(true); // Still allow the page to function
      }
    };

    fetchFilters();
  }, []);

  const { people, loadingState: peopleLoading } = usePeople({
    search: "",
    filterBy,
    sort,
    page: 1,
    limit: 100,
    sortBy,
  });

  useEffect(() => {
    if (!selectedFamily && familyGroups.length > 0) {
      setSelectedFamily(familyGroups[0]);
    }
  }, [familyGroups, familiesLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileFamilyDropdownRef.current &&
        !mobileFamilyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileFamilyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const filteredFamilies = useMemo(() => {
    if (!familySearch) {
      return familyGroups;
    }

    return familyGroups.filter((family, index) => {
      const label = family.family_name || `Family ${index + 1}`;
      return label.toLowerCase().includes(familySearch.toLowerCase());
    });
  }, [familyGroups, familySearch]);

  const selectedFamilyPersonId = useMemo(() => {
    if (selectedFamily !== null) {
      return selectedFamily.person_id;
    } else if (familyGroups.length > 0) {
      return familyGroups[0].person_id;
    }

    return selectedPersonId || user?.person_id || undefined;
  }, [selectedFamily, familyGroups.length, selectedPersonId, user?.person_id]);

  const onSearchChange = (value: string) => setFamilySearch(value);

  const handleFamilyClick = (family: any) => {
    const selected =
      typeof family === "string"
        ? familyGroups.find((item) => item.id === family) || null
        : family;
    console.log("Selected family:", selected);
    setSelectedFamily(selected);
    setFamilySearch("");
    setIsMobileFamilyDropdownOpen(false);
  };

  const handleDownload = async () => {
    const currentPersonId = selectedPersonId || user?.person_id || "";
    await downloadProfilePdf(currentPersonId);
  };

  const handleProfileUpdate = () => {
    const currentPersonId = selectedPersonId || user?.person_id || "";
    if (currentPersonId) fetchProfile(currentPersonId);
  };
  const formFields: FormField[] = [
    {
      name: "photo",
      label: t("dashboard.profile.personalDetails.photo", "Profile Photo"),
      type: "file",
      value: null,
      accept: "image/*",
      placeholder: "Choose profile photo",
    },
    {
      name: "firstname",
      label: t("dashboard.profile.personalDetails.firstName", "First Name"),
      type: "text",
      value: null,
      required: true,
    },
    {
      name: "lastname",
      label: t("dashboard.profile.personalDetails.lastName", "Last Name"),
      type: "text",
      value: null,
    },
    {
      name: "surname",
      label: t("dashboard.profile.personalDetails.surname", "Surname"),
      type: "text",
      value: null,
      required: true,
    },
    {
      name: "gender",
      label: t("dashboard.profile.personalDetails.gender", "Gender"),
      type: "select",
      value: null,
      options: [
        { value: "m", label: "Male" },
        { value: "f", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    {
      name: "dob",
      label: t(
        "dashboard.profile.personalDetails.dateOfBirth",
        "Date of Birth",
      ),
      type: "date",
      value: null,
    },
    {
      name: "dod",
      label: t(
        "dashboard.profile.personalDetails.dateOfDeath",
        "Date of Death",
      ),
      type: "date",
      value: null,
    },
    {
      name: "pob",
      label: t(
        "dashboard.profile.personalDetails.placeOfBirth",
        "Place of Birth",
      ),
      type: "text",
      value: null,
    },
    {
      name: "gothra",
      label: t("dashboard.profile.personalDetails.gotra", "Gotra"),
      type: "text",
      value: null,
    },
    {
      name: "blood_group",
      label: t("dashboard.profile.personalDetails.bloodGroup", "Blood Group"),
      type: "select",
      value: null,
      options: [
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" },
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" },
      ],
    },
    {
      name: "marriage_date",
      label: t(
        "dashboard.profile.personalDetails.dateOfMarriage",
        "Date of Marriage",
      ),
      type: "date",
      value: null,
    },
    {
      name: "state",
      label: t("dashboard.profile.personalDetails.state", "State"),
      type: "text",
      value: null,
    },
    {
      name: "city",
      label: t("dashboard.profile.personalDetails.city", "City"),
      type: "text",
      value: null,
    },
    {
      name: "pincode",
      label: t("dashboard.profile.personalDetails.pincode", "Pincode"),
      type: "text",
      value: null,
    },
    {
      name: "country",
      label: t("dashboard.profile.personalDetails.country", "Country"),
      type: "text",
      value: null,
    },
    {
      name: "residentialAddress",
      label: t(
        "dashboard.profile.personalDetails.residentialAddress",
        "Residential Address",
      ),
      type: "textarea",
      value: null,
    },
    {
      name: "education",
      label: t("dashboard.profile.personalDetails.education", "Education"),
      type: "text",
      value: null,
    },
    {
      name: "email",
      label: t("dashboard.profile.personalDetails.email", "Email"),
      type: "email",
      value: null,
    },
    {
      name: "mobile",
      label: t("dashboard.profile.personalDetails.mobile", "Mobile"),
      type: "tel",
      value: null,
    },
    {
      name: "whatsapp",
      label: t("dashboard.profile.personalDetails.whatsapp", "WhatsApp"),
      type: "tel",
      value: null,
    },
    {
      name: "kutumbhNo",
      label: t("dashboard.profile.personalDetails.kutumbhNo", {
        defaultValue: "Kutumbh No.",
      }),
      type: "text",
      value: null,
    },
    {
      name: "pageNo",
      label: t("dashboard.profile.personalDetails.pageNo", {
        defaultValue: "Page No.",
      }),
      type: "text",
      value: null,
    },
  ];

  const addPersonHandler = async (formData: any) => {
    const apiPayload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      surname: formData.surname,
      gender: formData.gender,
      photo: formData.photo.value,
      dob: formData.dob,
      dod: formData.dod,
      street: formData.street,
      city: formData.city,
      postal_code: formData.pincode || formData.postal_code,
      country: formData.country,
      phone: formData.mobile || formData.phone,
      email: formData.email,
      whatsapp: formData.whatsapp,
      kutumb_number: formData.kutumbhNo || formData.kutumb_number,
      page_number: formData.pageNo || formData.page_number,
      gotra: formData.gothra || formData.gotra,
      education: formData.education,
      pob: formData.pob,
    };
    try {
      const response = await peopleService.addPerson(apiPayload);
      if (response?.success) {
        const newPersonId = response.data?.person_id;
        if (newPersonId) {
          showSuccess("Person added successfully");
          closeDrawer();
        }
      }
    } catch (error) {
      console.error("Error adding person:", error);
      showError("Failed to add person. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 sm:gap-6 px-3 sm:px-4 py-4 sm:py-6 min-h-screen">
      {/* Welcome heading */}
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-heading-3 md:text-heading-4 lg:text-heading-3 text-text-main font-bold capitalize text-[#1D2D38] mb-3">
          {t("dashboard.welcome")}
        </h1>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto">
        <hr style={{ border: "none", borderTop: "2px solid #98664B80" }} />
      </div>

      {/* Family Tree Browser Panel */}
      <div className="w-full max-w-7xl mx-auto">
        {/* 
          Mobile: two rows
            Row 1 → Back + Title
            Row 2 → Search + Toggle
          Desktop (md+): single row
            Back + Title | Search (capped) + Toggle
        -->
        */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
          {/* Title */}

          <h2 className="text-heading-5 w-full md:w-1/2 md:text-heading-4 lg:text-heading-3 text-text-main font-bold capitalize text-[#1C1811]">
            Family Chart Browser
          </h2>

          {/* Right: Search (capped width) + Toggle */}
          <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
            <div className="w-full flex gap-2 md:flex-row md:items-center md:justify-end md:w-98">
              <SearchBar
                variant="light"
                placeholder="Search by Kutumbh No., Name, etc"
                className="w-full md:w-[320px]"
                loading={
                  peopleLoading === "search" || peopleLoading === "filter"
                }
                value={familySearch}
                onChange={onSearchChange}
              />
              {isAdminUser && (
                <Button
                  variant="primary"
                  onClick={() => {
                    openDrawer(
                      t("pages.dashboard.addPersonButton"),
                      formFields,
                    );
                  }}
                  className="w-full"
                >
                  <span className="hidden sm:inline">
                    {" "}
                    {t("pages.dashboard.addPersonButton")}
                  </span>
                  <span className="inline sm:hidden text-[10px]">
                    {t("pages.dashboard.addPersonButton")}
                  </span>
                </Button>
              )}
            </div>

            {/* <ViewModeToggle
              gridOptions={[
                { label: "All Families", value: "" },
                { label: "Active Families", value: "active" },
              ]}
              listOptions={sortKeys}
              selectedGridOption={filterBy || ""}
              selectedListOption={sort}
              onGridOptionChange={setFilterBy}
              onListOptionChange={setSort}
              onGridClick={() => setViewMode("grid")}
              onListClick={() => setViewMode("list")}
            /> */}
          </div>
        </div>

        {/* Mobile Family Selector */}
        <div className="sm:hidden">
          {familiesLoading && (
            <div className="w-full py-4 flex justify-center">
              <Loader message="Loading families..." />
            </div>
          )}

          {!familiesLoading && filteredFamilies.length === 0 && (
            <div className="text-sm text-[#3b2a14] flex h-8 items-center justify-center bg-[#FFFAF0] border border-[#DAD1BC] rounded-md">
              No families found.
            </div>
          )}

          {!familiesLoading && filteredFamilies.length > 0 && (
            <FormSelect
              label={""}
              value={selectedFamily?.id || ""}
              onChange={handleFamilyClick}
              options={filteredFamilies.map((family) => ({
                value: family.id,
                label:
                  family.family_name ||
                  `Family ${familyGroups.indexOf(family) + 1}`,
              }))}
              placeholder="Select Family"
              background="#FFFAF0"
              textColor="#3b2a14"
              className="w-full"
              borderRadius="24px"
            />
          )}
        </div>

        {/* Desktop Family Pill Selector */}
        <div className="text-family-pill hidden sm:flex gap-2 flex-wrap overflow-visible pb-1 scrollbar-hide">
          {familiesLoading && (
            <div className="w-full py-4 flex justify-center flex-shrink-0">
              <Loader message="Loading families..." />
            </div>
          )}

          {!familiesLoading && filteredFamilies.length === 0 && (
            <div className="text-sm w-full text-[#3b2a14] flex h-8 items-center justify-center bg-[#FFFAF0] border border-[#DAD1BC] rounded-md">
              No families found.
            </div>
          )}

          {!familiesLoading &&
            filteredFamilies.map((family) => (
              <button
                key={family.id}
                onClick={() => handleFamilyClick(family)}
                className={`
                  flex-shrink-0
                  rounded-full px-3 sm:px-4 py-1.5 border
                  transition-all
                  text-xs sm:text-sm
                  whitespace-nowrap
                  touch-manipulation
                  cursor-pointer
                  ${
                    selectedFamily?.id === family.id
                      ? "bg-[#3D2B1F] border-[#3D2B1F] !text-white shadow-sm"
                      : "bg-transparent border-[#1B1903] hover:bg-[#ede5d0]"
                  }
                `}
              >
                {family.family_name ||
                  `Family ${familyGroups.indexOf(family) + 1}`}
              </button>
            ))}
        </div>

        {/* Family Tree Viewport */}
        <div className="mt-3 sm:mt-4 rounded-xl border border-[#e2d5bb] bg-[#faf7f0] p-0 sm:p-4 h-[80vh] overflow-auto">
          {selectedFamilyPersonId ? (
            <div className="tab-content-wrapper max-w-8xl mx-auto">
              <FamilyTree
                personId={selectedFamilyPersonId}
                onAttachedFamilyClick={(familyId) =>
                  handleFamilyClick(familyId)
                }
              />
            </div>
          ) : (
            <div className="h-[350px] sm:h-[450px] flex items-center justify-center text-center px-4">
              <div className="text-sm text-[#8a7560]">
                Select a family group using the pills above to view its tree.
              </div>
            </div>
          )}
        </div>
      </div>
      <EditDrawer
        title={t("pages.dashboard.addPersonButton")}
        onClose={closeDrawer}
        isOpen={isDrawerOpen}
      >
        <EditForm onSave={addPersonHandler} />
      </EditDrawer>
    </div>
  );
}
