import { useTranslation } from "react-i18next";
import {
  Button,
  ConfirmationModal,
  Divider,
  FunctionalButton,
  SearchBar,
  SectionTitle,
} from "../components/ui";
import type { SortKey } from "../components/ui/FunctionalButton";
import ProfileFrame from "../components/ui/ProfileFrame";
import { usePeople } from "../hooks/usePeople";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Loader from "../components/ui/Loader";
import { useDashboardState } from "../contexts/DashboardContext";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashborad";
import peopleService from "../services/people";
import { useToast } from "../hooks";
import { isAdmin } from "../utils/userUtils";
import { useAuth } from "../contexts";
// Types for the query params
type SortField =
  | "firstname"
  | "lastname"
  | "surname"
  | "dob"
  | "kutumb_number"
  | "page_number"
  | "kutumb_no"
  | "page_no"
  | "";
type SortOrder = "asc" | "desc";
const DEFAULT_LIMIT = 12;

export default function Member() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdminUser = isAdmin(user);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { setSelectedPersonId, setActiveTab } = useDashboardState();
  const { showError, showSuccess } = useToast();
  // State for query params
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isDeletdProfiles, setIsDeletdProfiles] = useState<boolean>(false);
  const limit = DEFAULT_LIMIT;
  const [sort, setSort] = useState<SortField>("firstname");
  const sortBy: SortOrder = "asc";
  const sortKeys: SortKey[] = [
    { label: "Name", value: "firstname" },
    { label: "Kutumb No", value: "kutumb_no" },
    { label: "Page Number", value: "page_no" },
  ];
  const [filtersLoaded, setFiltersLoaded] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<any>(null);
  const [mainPersonsOnly, setMainPersonsOnly] = useState<boolean>(true);

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPersonToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (personToDelete) {
      deletePersonHandler(personToDelete);
    }
    handleCloseDeleteModal();
  };
  const debouncedSearch = useDebounce<string>(search, 500);
  const { dashboardInfo } = useDashboard();
  useEffect(() => {
    setFiltersLoaded(true);
  }, []);

  const params = {
    search: debouncedSearch,
    page,
    limit,
    sort,
    sortBy,
    deleted_profiles: isDeletdProfiles,
    main_person_only: mainPersonsOnly, // Default to false, can be toggled when fetching deleted profiles
  };
  const { people, loadingState, error, hasMorePages, totalCount, fetchPeople } =
    usePeople(params);
  console.log(
    "People data:",
    people,
    "Loading state:",
    loadingState,
    "Error:",
    error,
  );
  // Use refs so the observer can read latest values without re-subscribing
  const loadingStateRef = useRef(loadingState);
  const hasMorePagesRef = useRef(hasMorePages);
  const peopleRef = useRef(people);
  useEffect(() => {
    loadingStateRef.current = loadingState;
  }, [loadingState]);
  useEffect(() => {
    hasMorePagesRef.current = hasMorePages;
  }, [hasMorePages]);
  useEffect(() => {
    peopleRef.current = people;
  }, [people]);

  // observe scroll bottom — only set up once, reads state via refs
  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          loadingStateRef.current === "idle" &&
          peopleRef.current &&
          peopleRef.current.length > 0 &&
          hasMorePagesRef.current
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, []); // Empty deps: set up once, refs keep values fresh

  // Reset to first page on search or sort change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, sortBy, isDeletdProfiles]);

  const handleViewProfile = (profileId: string) => {
    console.log("View profile:", profileId);
    setSelectedPersonId(profileId);
    setActiveTab("profile");
    // navigate("/member-profile");
    navigate(`/member-profile/${profileId}`);
  };

  const handleFamilyChart = (profileId: string) => {
    console.log("Family chart:", profileId);
    setSelectedPersonId(profileId);
    setActiveTab("chart");
    navigate(`/member-profile/${profileId}`);
    // Add family chart logic here
  };

  const handleSortKeyChange = (sortKey: string) => {
    setSort(sortKey as SortField);
  };
  const deletePersonHandler = async (profile: any) => {
    const apiPayload = {
      person_id: profile.id,
      firstname: profile.firstname,
      lastname: profile.lastname,
      surname: profile.surname,
      gender: profile.gender === "Male" ? "m" : "f",
      photo: profile.photo,
      dob: profile.dob,
      dod: profile.dod,
      street: profile.street,
      city: profile.city,
      postal_code: profile.postal_code,
      country: profile.country,
      phone: profile.phone,
      email: profile.email,
      whatsapp: profile.whatsapp,
      kutumb_number: profile.kutumb_number,
      page_number: profile.page_number,
      gotra: profile.gotra,
      education: profile.education,
      pob: profile.pob,
      delete: true,
    };
    try {
      const response: any = await peopleService.updatePerson(
        apiPayload,
        profile.id,
      );
      if (response?.success) {
        showSuccess("Person deleted successfully");
        fetchPeople(); // Refetch people after successful deletion
      } else {
        console.error("Failed to delete person");
        showError("Failed to delete person");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showError("An error occurred while deleting the person");
    }
  };
  const getDeletedProfiles = async () => {
    setIsDeletdProfiles(true);
    setMainPersonsOnly(false); // Show all deleted profiles, not just main persons
  };

  const getMembersProfiles = async () => {
    setIsDeletdProfiles(false);
    setMainPersonsOnly(true); // When viewing active members, show only main persons
  };

  const renderPeopleGrid = () => {
    if (!filtersLoaded || loadingState === "initial") {
      return (
        <div className="mt-12 w-full min-h-96 ">
          <Loader message={t("member.loading.people")} />
        </div>
      );
    }
    if (error) {
      return (
        <div className="mt-4 w-full min-h-48 flex items-center justify-center text-text-main">
          {t("member.errors.loadingPeople")}
        </div>
      );
    }
    if ((loadingState === "idle" && !people) || people?.length === 0) {
      return (
        <div className="mt-4 w-full min-h-48 flex items-center justify-center text-text-main">
          {t("member.errors.noPeopleFound")}
        </div>
      );
    }
    return (
      <div className="profiles-grid mt-11">
        {people?.map((profile) => (
          <ProfileFrame
            key={profile.id}
            src={profile.photo}
            name={
              profile.firstname +
              " " +
              (profile.lastname ?? "") +
              " " +
              profile.surname
            }
            kutumb_no={profile.kutumb_number}
            page_no={profile.page_number}
            onViewProfile={() => handleViewProfile(profile.id)}
            onFamilyChart={() => handleFamilyChart(profile.id)}
            onDeleteClick={
              isDeletdProfiles
                ? undefined
                : () => {
                    setPersonToDelete(profile);
                    setIsDeleteModalOpen(true);
                  }
            }
            // className="md:!w-64 2xl:!w-72"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="">
      {isAdminUser && (
        <div className="flex justify-end">
          <h1
            className="text-end text-xs text-gray-500 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={isDeletdProfiles ? getMembersProfiles : getDeletedProfiles}
          >
            {isDeletdProfiles ? "Go Back" : t("member.buttons.deletedProfiles")}
          </h1>
        </div>
      )}
      <SectionTitle
        title={
          isDeletdProfiles
            ? `${t("member.buttons.deletedProfiles")} (${totalCount})`
            : `${t("member.title")} (${totalCount})`
        }
        onClick={getMembersProfiles}
      />
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-2 mt-4 w-full">
        <SearchBar
          variant="light"
          placeholder={t("member.searchPlaceholder")}
          className="w-full md:w-96"
          loading={loadingState === "search"}
          value={search}
          onChange={(value) => setSearch(value)}
        />
        <span className="hidden md:inline-block">
          <Divider color="light" />
        </span>
        <FunctionalButton
          leftText={t("member.buttons.filter")}
          sortKeys={sortKeys}
          selectedSortKey={sort}
          onSortKeyChange={handleSortKeyChange}
          className="flex-shrink-0"
        />
      </div>
      {renderPeopleGrid()}
      {/* Loader for pagination */}
      <div
        ref={loaderRef}
        className="h-12 flex items-center justify-center mt-12"
      >
        {loadingState === "pagination" && (
          <Loader message={t("member.loading.more")} />
        )}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={t(
          "member.confirmDeleteMessage",
          "Are you sure you want to delete this member? This action cannot be undone.",
        )}
        title={t("member.confirmDeleteTitle", "Confirm Delete")}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
