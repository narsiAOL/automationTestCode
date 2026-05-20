import { use, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import type { DashboardTab } from "../components/DashboardHeader";
import {
  ProfileTab,
  BusinessCardTab,
  ChartTab,
  BhaktiGeetTab,
  MoreTab,
} from "../components/dashboard";
import { useDashboardState } from "../contexts/DashboardContext";
import { useAuth, useDrawer, type FormField } from "../contexts";
import { useProfile, useDownload, useToast } from "../hooks";
import Loader from "../components/ui/Loader";
import { useParams } from "react-router-dom";
import { EditDrawer } from "../components/ui";
import EditForm from "../components/dashboard/EditForm";
import { useTranslation } from "react-i18next";
import { getBusinessDetailsData } from "../components/dashboard/_profile/profileCardData";
import peopleService from "../services/people";

export default function MemberProfile() {
  const { user } = useAuth();
  const { activeTab, setActiveTab, selectedPersonId, setSelectedPersonId } =
    useDashboardState();
  const { t } = useTranslation();
  const { id, tab } = useParams();

  // choose correct person id
  const personId = id || selectedPersonId || user?.person_id || "";

  const { profile, loading, error, fetchProfile } = useProfile(personId);
  const { isDownloading, downloadProfilePdf } = useDownload();

  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawer();

  const { showSuccess, showError } = useToast();
  const businessInformation = profile?.business_details?.[0] || {};
  const businessDetailsData = getBusinessDetailsData(businessInformation, t);
  const onEditBusiness = () => {
    const formFields: FormField[] = businessDetailsData.map((detail) => ({
      name: detail.label.toLowerCase().replace(/\s+/g, "_"),
      label: detail.label,
      type: "text",
      value: detail.value === "--" ? "" : detail.value,
    }));

    openDrawer(
      `Edit ${t("dashboard.profile.sections.businessInformation")}`,
      formFields,
    );
  };

  const editHandler = async (
    formData: Record<string, any>,
    fields: FormField[],
  ) => {
    const payload: any = businessInformation;
    payload.person_id = id; // Associate with current profile
    const apiPayload = {
      business_name: formData.name,
      address_1: formData.address_1,
      address_2: formData.address_2,
      email: formData.email,
      phone: formData.mobile_no,
      whatsapp: formData.whatsapp_no,
      website: formData.website,
      instagram: formData.instagram,
      facebook: payload.facebook,
      person_id: payload.person_id,
      business_id: payload.id,
      business_category: payload.business_category,
      city: payload.city,
      state: payload.state,
      country: payload.country,
      pincode: payload.pincode,
    };
    const response = await peopleService.editBusiness(apiPayload);
    if (response?.success) {
      showSuccess("Business updated successfully");

      fetchProfile(id!);
      closeDrawer();
    } else {
      showError("Failed to update business");
    }
  };

  // restore selectedPersonId after refresh
  useEffect(() => {
    if (id && id !== selectedPersonId) {
      setSelectedPersonId(id);
    }
  }, [id]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  const handleDownload = async () => {
    if (personId) {
      await downloadProfilePdf(personId);
    }
  };

  const handleProfileUpdate = () => {
    fetchProfile(id || personId);
    console.log("Profile updated, refetching profile data...");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            profile={profile}
            loading={loading}
            error={error}
            onProfileUpdate={handleProfileUpdate}
          />
        );

      case "businessCard":
        return (
          <BusinessCardTab
            loading={loading}
            error={error}
            business_details={profile?.business_details}
            onEditBusiness={onEditBusiness}
          />
        );

      case "chart":
        return <ChartTab profile={profile} />;

      case "bhaktiGeet":
        return <BhaktiGeetTab />;

      case "more":
        return <MoreTab />;

      default:
        return (
          <ProfileTab
            profile={profile}
            loading={loading}
            error={error}
            onProfileUpdate={handleProfileUpdate}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader message="Loading profile..." />
      </div>
    );
  }

  if (!personId) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        No profile data available
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <DashboardHeader
        activeTab={activeTab}
        profile={profile}
        onTabChange={handleTabChange}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
      <div className="flex-1 w-full h-full">{renderTabContent()}</div>
      {activeTab === "businessCard" && (
        <EditDrawer
          title={`Edit ${t("dashboard.profile.sections.businessInformation")}`}
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
        >
          <EditForm onSave={editHandler} />
        </EditDrawer>
      )}
    </div>
  );
}
