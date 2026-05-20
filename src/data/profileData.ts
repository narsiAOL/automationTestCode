// Dummy data simulating /profile API response
export type ProfileApiResponse = {
  personal_details: {
    id: string;
    photo: string | null;
    firstname: string;
    lastname: string;
    surname: string;
    gender: string | null;
    dob: string | null;
    blood_group: string | null;
    gothra: string | null;
    email: string | null;
    phone: string | null;
    mobile: string | null;
    whatsapp: string | null;
    kutumb_number: string | null;
    page_number: string | null;
    dod: string | null;
    marriage_date: string | null;
    education: string | null;
    pob: string | null;

    // Extra (from ProfileApiResponse but optional)
    dateOfBirth?: string;
    placeOfBirth?: string;
    gotra?: string;
    bloodGroup?: string;
    dateOfMarriage?: string;
    maritalStatus?: string;
    profileImage?: string;
    state?: string;
    city?: string;
    pincode?: string;
    country?: string;
    residentialAddress?: string;
  };

  family_details: {
    father_name: string | null;
    mother_name: string | null;
    grandfather_name: string | null;
    grandmother_name: string | null;

    // Extra
    grandfather?: string;
    grandmother?: string;
    father?: string;
    mother?: string;
  };

  spouse_details: {
    spouse_name: string | null;
    spouse_father_name: string | null;
    spouse_dob: string | null;
    spouse_blood_group: string | null;
    spouse_email: string | null;
    spouse_phone: string | null;
    spouse_whatsapp: string | null;
    spouse_kutumb_number: string | null;
    spouse_page_number: string | null;
    spouse_community: string | null;

    // Extra
    firstName?: string;
    middleName?: string;
    surname?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    gotra?: string;
    bloodGroup?: string;
    education?: string;
    email?: string;
    mobile?: string;
    whatsapp?: string;
    profileImage?: string;
  };

  business_details: {
    id: string;
    person_id: string;
    business_name: string;
    address_1: string | null;
    address_2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
    business_category: string | null;
    created_at: string;
    updated_at: string;

    // Extra
    name?: string;
    address?: string;
  }[];

  children_details: {
    id: string;
    dob: string | null;
    sex: "m" | "f" | string;
    full_name: string;
    role: string;

    // Extra
    elderDaughter?: string;
    elderSon?: string;
    youngerSon?: string;
  }[];

  siblings_details: {
    id: string;
    dob: string | null;
    sex: "m" | "f" | string;
    full_name: string;
    role: string;

    // Extra
    elderBrother?: string;
    elderSister?: string;
    youngerBrother?: string;
  }[];
};

export const dummyProfileData: ProfileApiResponse = {
  personal_details: {
    id: "",
    photo: null,
    firstname: "",
    lastname: "",
    surname: "",
    gender: null,
    dob: null,
    blood_group: null,
    gothra: null,
    email: null,
    phone: null,
    mobile: null,
    whatsapp: null,
    kutumb_number: null,
    page_number: null,
    dod: null,
    marriage_date: null,
    education: null,
    pob: null,

    // Optional (legacy / UI fields)
    dateOfBirth: undefined,
    placeOfBirth: undefined,
    gotra: undefined,
    bloodGroup: undefined,
    dateOfMarriage: undefined,
    maritalStatus: undefined,
    profileImage: undefined,
    state: undefined,
    city: undefined,
    pincode: undefined,
    country: undefined,
    residentialAddress: undefined,
  },
  family_details: {
    father_name: null,
    mother_name: null,
    grandfather_name: null,
    grandmother_name: null,

    // Extra
    grandfather: undefined,
    grandmother: undefined,
    father: undefined,
    mother: undefined,
  },
  spouse_details: {
    spouse_name: null,
    spouse_father_name: null,
    spouse_dob: null,
    spouse_blood_group: null,
    spouse_email: null,
    spouse_phone: null,
    spouse_whatsapp: null,
    spouse_kutumb_number: null,
    spouse_page_number: null,
    spouse_community: null,

    // Extra
    firstName: undefined,
    middleName: undefined,
    surname: undefined,
    dateOfBirth: undefined,
    placeOfBirth: undefined,
    gotra: undefined,
    bloodGroup: undefined,
    education: undefined,
    email: undefined,
    mobile: undefined,
    whatsapp: undefined,
    profileImage: undefined,
  },
  business_details: [
    {
      id: "",
      person_id: "",
      business_name: "",
      address_1: null,
      address_2: null,
      city: null,
      state: null,
      country: null,
      pincode: null,
      email: null,
      phone: null,
      whatsapp: null,
      website: null,
      instagram: null,
      facebook: null,
      twitter: null,
      business_category: null,
      created_at: "",
      updated_at: "",

      // Extra
      name: undefined,
      address: undefined,
    },
  ],
  children_details: [
    {
      id: "",
      dob: null,
      sex: "",
      full_name: "",
      role: "",

      // Extra
      elderDaughter: undefined,
      elderSon: undefined,
      youngerSon: undefined,
    },
  ],
  siblings_details: [
    {
      id: "",
      dob: null,
      sex: "",
      full_name: "",
      role: "",

      // Extra
      elderBrother: undefined,
      elderSister: undefined,
      youngerBrother: undefined,
    },
  ],
};
