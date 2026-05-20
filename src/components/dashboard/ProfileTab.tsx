import PersonalDetailsForm from "./_profile/PersonalDetailsForm";
import SpouseDetailsContent from "./_profile/SpouseDetailsContent";
import AdsContent from "./_profile/AdsContent";
import {
  getFamilyDetailsData,
  getChildrenDetailsData,
  getSiblingDetailsData,
  getBusinessDetailsData,
  getSpouseDetailsData,
} from "./_profile/profileCardData";
import DetailsCard from "./DetailsCard";
import { useAuth } from "../../contexts";
import { useDashboardState } from "../../contexts/DashboardContext";
import { useProfile, type ProfileDetails } from "../../hooks/useProfile";
import Loader from "../ui/Loader";
import { useTranslation } from "react-i18next";
import {
  DrawerProvider,
  useDrawer,
  type FormField,
} from "../../contexts/DrawerContext";
import { ConfirmationModal, EditDrawer } from "../ui";
import EditForm from "./EditForm";
import peopleService from "../../services/people";
import userService from "../../services/user";
import { mapFormDataToPersonalDetailsAPI } from "../../utils/formDataMapper";
import { useToast } from "../../hooks/useToast";
import { useState } from "react";

function ProfileTabContent({
  profile,
  loading,
  error,
  onProfileUpdate,
}: {
  profile?: ProfileDetails | null;
  loading: boolean;
  error: string | null;
  onProfileUpdate?: () => void;
}) {
  const { t } = useTranslation();
  const [editingProfile, setEditingProfile] = useState<ProfileDetails | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    openDrawer,
    isDrawerOpen,
    drawerTitle,
    closeDrawer,
    resetForm,
    setLoading,
    setError,
  } = useDrawer();
  const { showSuccess, showError } = useToast();
  const { fetchProfile } = useProfile(profile?.personal_details?.id); // Ensure we have an ID to fetch profile data
  const handleEditSave = async (
    formData: Record<string, string>,
    fields: FormField[],
  ) => {
    if (drawerTitle === "Add Business") {
      handleAddBusiness(formData, fields);
      return;
    }
    if (drawerTitle === "Edit Business Information") {
      handleEditBusiness(formData);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const photoField = fields.find((f) => f.name === "photo");
      const safePhoto: any = formData.photo ?? "";
      let photoUrl =
        typeof safePhoto === "object" && safePhoto !== null
          ? safePhoto.value
          : safePhoto;
      if (
        photoField &&
        typeof safePhoto === "object" &&
        safePhoto !== null &&
        safePhoto.file
      ) {
        try {
          const uploadResult = await userService.uploadAvatar(
            safePhoto.file as File,
          );
          photoUrl = uploadResult.avatarUrl;
        } catch (uploadError) {
          console.warn(
            "Avatar upload failed, continuing with existing photo.",
            uploadError,
          );
        }
      }
      let apiPayload;
      let personId;
      if (editingProfile !== null) {
        personId = editingProfile?.personal_details?.id;
        apiPayload = mapFormDataToPersonalDetailsAPI(
          { ...formData, photo: photoUrl },
          personId,
          editingProfile,
        );
      } else {
        personId = profile?.personal_details?.id;
        apiPayload = mapFormDataToPersonalDetailsAPI(
          { ...formData, photo: photoUrl },
          personId,
          profile,
        );
      }

      if (drawerTitle === "Edit Profile") {
        //now call only for profile update later implement for all others
        await peopleService.updatePersonalDetails(apiPayload);
        const sectionName = drawerTitle.toLowerCase().includes("personal")
          ? "Personal"
          : "Profile";
        showSuccess(`Successfully updated the ${sectionName} details`);
      }
      // await fetchProfile(profile?.personal_details?.id);
      closeDrawer();
      setEditingProfile(null);
      resetForm();
      onProfileUpdate?.();
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage =
        errorData?.message ||
        errorData?.data ||
        err.message ||
        t("dashboard.profile.editForm.saveError");
      showError(`Failed to update details: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleAddBusiness = async (
    formData: Record<string, string>,
    fields: FormField[],
  ) => {
    const payload = formData; // Map formData to API payload as needed
    payload.person_id = profile?.personal_details?.id; // Associate with current profile
    const apiPayload = {
      person_id: payload.person_id,
      business_name: payload.business_name,
      business_category: payload.business_category,
      address_1: payload.address_1,
      address_2: payload.address_2,
      city: payload.city,
      state: payload.state,
      country: payload.country,
      pincode: payload.pincode,
      email: payload.email,
      phone: payload.phone,
      whatsapp: payload.whatsapp,
      website: payload.website,
      instagram: payload.instagram,
      facebook: payload.facebook,
    };
    const response = await peopleService.addBusiness(apiPayload);
    if (response?.success) {
      showSuccess("Business details added successfully");
      onProfileUpdate?.(); // Refresh profile data to show new business details
    } else {
      showError("Failed to add business details");
    }
    closeDrawer();
  };

  // For form fields: return empty string for null/undefined/"-" API sentinel values
  const getFormFieldValue = (value: string | null | undefined): string => {
    if (!value || value.trim() === "" || value.trim() === "-") return "";
    return value;
  };

  const handleEditProfile = async (id: string) => {
    const fetchProfile = async (id: string) => {
      try {
        const data = await peopleService.getPersonById(id);
        return data;
      } catch (error) {
        console.error("Failed to fetch profile for editing:", error);
        return null;
      }
    };
    const editProfile = await fetchProfile(id);
    setEditingProfile(editProfile);

    const profileData = editProfile?.personal_details;
    const formFields: FormField[] = [
      {
        name: "photo",
        label: t("dashboard.profile.personalDetails.photo"),
        type: "file",
        value: getFormFieldValue(profileData.photo),
        accept: "image/*",
        placeholder: "Choose profile photo",
      },
      {
        name: "firstname",
        label: t("dashboard.profile.personalDetails.firstName"),
        type: "text",
        value: getFormFieldValue(profileData.firstname),
        required: true,
      },
      {
        name: "lastname",
        label: t("dashboard.profile.personalDetails.lastName"),
        type: "text",
        value: getFormFieldValue(profileData.lastname ?? ""),
      },
      {
        name: "surname",
        label: t("dashboard.profile.personalDetails.surname"),
        type: "text",
        value: getFormFieldValue(profileData.surname),
        required: true,
      },
      {
        name: "gender",
        label: t("dashboard.profile.personalDetails.gender"),
        type: "select",
        value: getFormFieldValue(profileData.gender)?.toLowerCase() ?? "",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "dob",
        label: t("dashboard.profile.personalDetails.dateOfBirth"),
        type: "date",
        value: getFormFieldValue(profileData.dob),
      },
      {
        name: "pob",
        label: t("dashboard.profile.personalDetails.placeOfBirth"),
        type: "text",
        value: getFormFieldValue(profileData.pob),
      },
      {
        name: "gothra",
        label: t("dashboard.profile.personalDetails.gotra"),
        type: "text",
        value: getFormFieldValue(profileData.gothra),
      },
      {
        name: "blood_group",
        label: t("dashboard.profile.personalDetails.bloodGroup"),
        type: "select",
        value: getFormFieldValue(profileData.blood_group),
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
        label: t("dashboard.profile.personalDetails.dateOfMarriage"),
        type: "date",
        value: getFormFieldValue(profileData.marriage_date),
      },
      {
        name: "state",
        label: t("dashboard.profile.personalDetails.state"),
        type: "text",
        value: getFormFieldValue(profileData.state),
      },
      {
        name: "city",
        label: t("dashboard.profile.personalDetails.city"),
        type: "text",
        value: getFormFieldValue(profileData.city),
      },
      {
        name: "pincode",
        label: t("dashboard.profile.personalDetails.pincode"),
        type: "text",
        value: getFormFieldValue(profileData.postal_code),
      },
      {
        name: "country",
        label: t("dashboard.profile.personalDetails.country"),
        type: "text",
        value: getFormFieldValue(profileData.country),
      },
      {
        name: "residentialAddress",
        label: t("dashboard.profile.personalDetails.residentialAddress"),
        type: "textarea",
        value: getFormFieldValue(profileData.street),
      },
      {
        name: "education",
        label: t("dashboard.profile.personalDetails.education"),
        type: "text",
        value: getFormFieldValue(profileData.education),
      },
      {
        name: "email",
        label: t("dashboard.profile.personalDetails.email"),
        type: "email",
        value: getFormFieldValue(profileData.email),
      },
      {
        name: "mobile",
        label: t("dashboard.profile.personalDetails.mobile"),
        type: "tel",
        value: getFormFieldValue(profileData.phone),
      },
      {
        name: "whatsapp",
        label: t("dashboard.profile.personalDetails.whatsapp"),
        type: "tel",
        value: getFormFieldValue(profileData.whatsapp),
      },
    ];
    openDrawer(t("dashboard.profile.personalDetails.editButton"), formFields);
  };
  const handleDeleteProfile = async (profileId: string) => {
    const apiPayload = {
      person_id: profileId,
      firstname: profile.personal_details.firstname,
      lastname: profile.personal_details.lastname,
      surname: profile.personal_details.surname,
      gender: profile.personal_details.gender === "Male" ? "m" : "f",
      photo: profile.personal_details.photo,
      dob: profile.personal_details.dob,
      dod: profile.personal_details?.dod || null,
      street: profile.personal_details.street,
      city: profile.personal_details.city,
      postal_code: profile.personal_details.postal_code,
      country: profile.personal_details.country,
      phone: profile.personal_details.phone,
      email: profile.personal_details.email,
      whatsapp: profile.personal_details.whatsapp,
      kutumb_number: profile.personal_details.kutumb_number,
      page_number: profile.personal_details.page_number,
      gothra: profile.personal_details.gothra,
      education: profile.personal_details.education,
      pob: profile.personal_details.pob,
      delete: true,
    };
    try {
      const response: any = await peopleService.updatePerson(
        apiPayload,
        profileId,
      );
      if (response?.success) {
        showSuccess("Person deleted successfully");
        setIsDeleteModalOpen(false);
        fetchProfile(profileId); // Refetch profile after deletion to update UI
      } else {
        console.error("Failed to delete person");
        setIsDeleteModalOpen(false);
        showError("Failed to delete person");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setIsDeleteModalOpen(false);
      showError("An error occurred while deleting the person");
    }
  };
  const handleEditBusiness = async (formData: any) => {
    const payload = profile?.business_details[0]; // Merge existing business details with form data for editing
    payload.person_id = profile?.personal_details?.id; // Associate with current profile
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
      showSuccess("Business Details updated successfully");
      resetForm();
      onProfileUpdate?.(); // Refresh profile data to show updated business details
    } else {
      showError("Failed to update business details");
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleConfirmDelete = () => {
    handleDeleteProfile(profile?.personal_details?.id || "");
  };

  if (loading) {
    return (
      <Loader
        message={t("dashboard.profile.loading")}
        spinnerClassName="mt-12 "
      />
    );
  }
  if (error) {
    return (
      <div className="text-primary-900">
        {t("dashboard.profile.error")}: {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-primary-900">{t("dashboard.profile.noData")}</div>
    );
  }

  return (
    <>
      <div className="tab-content-wrapper">
        <PersonalDetailsForm
          personalDetails={profile?.personal_details}
          handleEditProfile={handleEditProfile}
          handleDeleteProfile={() => setIsDeleteModalOpen(true)}
        />

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl lg:h-[368px] relative">
          <div className="h-full mb:w-[35%]">
            <DetailsCard
              title={t("dashboard.profile.sections.familyDetails")}
              details={getFamilyDetailsData(profile?.family_details, t)}
              collapsibleOnMobile={true}
              showEditButton={false}
              enableEditDrawer={false}
              onEditPerson={handleEditProfile}
            />
          </div>
          <div className="h-full flex-1">
            <DetailsCard
              title={t("dashboard.profile.sections.spouseDetails")}
              showEditButton={profile?.spouse_details?.spouse_id ? true : false}
              details={getSpouseDetailsData(profile?.spouse_details, t)}
              collapsibleOnMobile={false}
              enableEditDrawer={true}
              onEditPerson={handleEditProfile}
            >
              <SpouseDetailsContent profile={profile} />
            </DetailsCard>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl lg:h-72">
          <div className="h-full flex-1">
            <DetailsCard
              title={t("dashboard.profile.sections.children")}
              details={getChildrenDetailsData(profile?.children_details, t)}
              collapsibleOnMobile={false}
              enableEditDrawer={false}
              showEditButton={false}
              onEditPerson={handleEditProfile}
            />
          </div>
          <div className="h-full flex-1">
            <DetailsCard
              title={t("dashboard.profile.sections.siblings")}
              details={getSiblingDetailsData(profile?.siblings_details, t)}
              collapsibleOnMobile={false}
              enableEditDrawer={false}
              showEditButton={false}
              onEditPerson={handleEditProfile}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl lg:h-80 relative">
          {/* <div className="h-full flex-1 lg:max-w-[80%]"> */}
          <div className="h-full flex-1">
            <DetailsCard
              title={t("dashboard.profile.sections.businessInformation")}
              details={getBusinessDetailsData(profile?.business_details[0], t)}
              editButtonText={t("dashboard.profile.buttons.editDetails")}
              collapsibleOnMobile={false}
              enableEditDrawer={true}
            />
          </div>
          {/* <div className="h-full flex-1 max-w-[450px]">
            <DetailsCard
              variant="dark"
              showEditButton={false}
              collapsibleOnMobile={false}
            >
              <AdsContent />
            </DetailsCard>
          </div> */}
        </div>
      </div>

      {/* Edit Drawer */}
      <EditDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={drawerTitle}
      >
        <EditForm onSave={handleEditSave} />
      </EditDrawer>
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
    </>
  );
}

export default function ProfileTab({
  profile,
  loading,
  error,
  onProfileUpdate,
}: {
  profile?: ProfileDetails | null;
  loading: boolean;
  error: string | null;
  onProfileUpdate?: () => void;
}) {
  return (
    <DrawerProvider>
      <ProfileTabContent
        profile={profile}
        loading={loading}
        error={error}
        onProfileUpdate={onProfileUpdate}
      />
    </DrawerProvider>
  );
}
