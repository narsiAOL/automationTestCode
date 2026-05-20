import { useEffect, useState } from "react";
import peopleService from "../services/people";
export type ProfileDetails = {
  personal_details: {
    id: string;
    photo: string | null;
    firstname: string;
    lastname: string;
    surname: string;
    gender: string | null;
    dob: string | null;
    dod: string | null;
    blood_group: string | null;
    gothra: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    kutumb_number: string | null;
    page_number: string | null;
    marriage_date: string | null;
    education: string | null;
    pob: string | null;
    city: string | null;
    state: string | null;
    street: string | null;
    postal_code: string | null;
    country: string | null;
    family_id: string | null;
  };
  family_details: {
    father_name: string | null;
    mother_name: string | null;
    grandfather_name: string | null;
    grandmother_name: string | null;
  };
  spouse_details: {
    spouse_id: string | null;
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
    created_at: string;
    updated_at: string;
    photo: string | null;
    business_category: string | null;
    website: string | null;
    instagram: string | null;
    facebook: string | null;
  }[];
  children_details: {
    id: string;
    dob: string | null;
    sex: "m" | "f" | string;
    full_name: string;
    role: string;
  }[];
  siblings_details: {
    id: string;
    dob: string | null;
    sex: "m" | "f" | string;
    full_name: string;
    role: string;
  }[];
};

export const useProfile = (id: string) => {
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await peopleService.getPersonById(id);
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch profile");
      setLoading(false);
    }
  };

  return { profile, setProfile, loading, error, fetchProfile };
};
