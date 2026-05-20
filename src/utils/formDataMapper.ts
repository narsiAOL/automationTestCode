/**
 * Maps form data to the API request body format for personal details update
 */
export function mapFormDataToPersonalDetailsAPI(
  formData: Record<string, string>,
  personId: string,
  existingProfile?: any,
): any {
  // Map gender values from form to API format
  const mapGender = (gender: string): string | null => {
    if (!gender) return null;
    switch (gender?.toLowerCase()) {
      case "male":
        return "m";
      case "female":
        return "f";
      case "other":
        return "o";
      default:
        return null;
    }
  };

  // Format date to yyyy-mm-dd format
  const formatDate = (dateString: string): string | null => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      return null;
    }
  };

  // Helper function to return null for empty strings
  const getValueOrNull = (value: string): string | null => {
    return value && value.trim() ? value.trim() : null;
  };

  // Convert absolute URL to relative path for photo in API payload.
  const normalizePhotoPath = (photo: string | undefined): string | null => {
    if (!photo) return null;

    const trimmed = photo.trim();
    if (!trimmed) return null;

    // Already relative path - check and remove /assets prefix if present
    if (trimmed.startsWith("/")) {
      // Remove /assets prefix if it exists
      return trimmed.replace(/^\/assets/, "");
    }

    // Parse absolute URL and extract pathname (including leading slash)
    try {
      const url = new URL(trimmed);
      let pathname = url.pathname + (url.search || "");
      // Remove /assets prefix from pathname as well
      pathname = pathname.replace(/^\/assets/, "");
      return pathname;
    } catch (error) {
      // not a valid URL, return as-is for backend to handle
      return trimmed;
    }
  };

  // return {
  //   person_id: personId,
  //   firstname: getValueOrNull(formData.firstname),
  //   lastname: getValueOrNull(formData.lastname), // Using lastname field
  //   surname: getValueOrNull(formData.surname),
  //   gender: mapGender(formData.gender || ""),
  //   photo: getValueOrNull(formData.photo),
  //   dob: formatDate(formData.dob || ""),
  //   dod: null, // Death date - not applicable for living persons
  //   street: getValueOrNull(formData.residentialAddress),
  //   city: getValueOrNull(formData.city),
  //   postal_code: getValueOrNull(formData.pincode),
  //   country: getValueOrNull(formData.country),
  //   phone: getValueOrNull(formData.mobile),
  //   email: getValueOrNull(formData.email),
  //   whatsapp: getValueOrNull(formData.whatsapp),
  //   kutumb_number: getValueOrNull(formData.kutumb_number), // Fixed field name
  //   page_number: getValueOrNull(formData.page_number), // Fixed field name
  //   gotra: getValueOrNull(formData.gothra),
  //   education: getValueOrNull(formData.education),
  //   pob: getValueOrNull(formData.pob),
  //   // Additional fields from the form
  //   state: getValueOrNull(formData.state),
  //   blood_group: getValueOrNull(formData.blood_group),
  //   marriage_date: formatDate(formData.marriage_date || ""),
  // };

  return {
    person_id: personId,
    firstname: getValueOrNull(formData.firstname),
    lastname: getValueOrNull(formData.lastname),
    surname:
      existingProfile?.personal_details?.surname ??
      getValueOrNull(formData.surname),
    gender: mapGender(formData.gender || ""),
    photo: normalizePhotoPath(formData.photo),
    dob: formatDate(formData.dob || ""),
    dod: formatDate(formData.dod || ""),
    street: getValueOrNull(formData.residentialAddress || formData.street),
    city: getValueOrNull(formData.city),
    postal_code: getValueOrNull(formData.pincode || formData.postal_code),
    country: getValueOrNull(formData.country),
    phone: getValueOrNull(formData.mobile || formData.phone),
    email: getValueOrNull(formData.email),
    whatsapp: getValueOrNull(formData.whatsapp),
    kutumb_number:
      getValueOrNull(formData.kutumb_number || formData.kutumbhNo) ??
      existingProfile?.personal_details?.kutumb_number ??
      null,
    page_number:
      getValueOrNull(formData.page_number || formData.pageNo) ??
      existingProfile?.personal_details?.page_number ??
      null,
    gotra: getValueOrNull(formData.gothra),
    education: getValueOrNull(formData.education),
    pob: getValueOrNull(formData.pob),
    state: getValueOrNull(formData.state),
    blood_group: getValueOrNull(formData.blood_group),
    marriage_date: formatDate(formData.marriage_date || ""),
    family_id: existingProfile?.personal_details?.family_id || null,
    family_details: existingProfile?.family_details || null,
    spouse_details: existingProfile?.spouse_details || null,
    business_details: existingProfile?.business_details || null,
    children_details: existingProfile?.children_details || null,
    siblings_details: existingProfile?.siblings_details || null,
  };
}

/**
 * Maps API response back to form data format (for future use)
 */
export function mapAPIResponseToFormData(apiData: any): Record<string, string> {
  // Map gender values from API to form format
  const mapGenderFromAPI = (gender: string): string => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "male";
      case "female":
        return "female";
      case "other":
        return "other";
      default:
        return "";
    }
  };

  return {
    person_id: apiData.id || apiData.person_id || "",
    firstname: apiData.firstname || "",
    lastname: apiData.lastname || "",
    surname: apiData.surname || "",
    gender: mapGenderFromAPI(apiData.gender || ""),
    photo: apiData.photo || "",
    dob: apiData.dob || "",
    city: apiData.city || "",
    pincode: apiData.postal_code || "",
    country: apiData.country || "",
    mobile: apiData.phone || "",
    email: apiData.email || "",
    whatsapp: apiData.whatsapp || "",
    kutumbhNo: apiData.kutumb_number || "",
    pageNo: apiData.page_number || "",
    gothra: apiData.gotra || "",
    education: apiData.education || "",
    pob: apiData.pob || "",
    state: apiData.state || "",
    blood_group: apiData.blood_group || "",
    marriage_date: apiData.marriage_date || "",
    residentialAddress: apiData.street || "",
  };
}
