// Dummy data simulating /members API response
export interface MembersApiResponse {
  members: MemberProfile[];
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

export interface MemberProfile {
  id: string;
  name: string;
  age: string;
  profileImage: string;
  kutumbhNo?: string;
  pageNo?: string;
  city?: string;
  state?: string;
  profession?: string;
  maritalStatus?: string;
}

// Dummy members data
export const dummyMembersData: MembersApiResponse = {
  totalCount: 50,
  pagination: {
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
  },
  members: [
    {
      id: "4209",
      name: "Motilal Govind Shah",
      age: "42",
      profileImage: "/mainprofile.png",
      kutumbhNo: "4209",
      pageNo: "15",
      city: "Mumbai",
      state: "Maharashtra",
      profession: "Engineer",
      maritalStatus: "Married",
    },
    {
      id: "3183",
      name: "Ishaan Rohan Shah",
      age: "23",
      profileImage: "/mainprofile.png",
      kutumbhNo: "3183",
      pageNo: "22",
      city: "Pune",
      state: "Maharashtra",
      profession: "Software Developer",
      maritalStatus: "Single",
    },
    {
      id: "6958",
      name: "Savitri Lakshmi Shah",
      age: "33",
      profileImage: "/mainprofile.png",
      kutumbhNo: "6958",
      pageNo: "45",
      city: "Bangalore",
      state: "Karnataka",
      profession: "Doctor",
      maritalStatus: "Married",
    },
    {
      id: "4149",
      name: "Kavya Nandini Shah",
      age: "19",
      profileImage: "/mainprofile.png",
      kutumbhNo: "4149",
      pageNo: "67",
      city: "Delhi",
      state: "Delhi",
      profession: "Student",
      maritalStatus: "Single",
    },
    {
      id: "9407",
      name: "Chandrakant Hariprasad Shah",
      age: "84",
      profileImage: "/mainprofile.png",
      kutumbhNo: "9407",
      pageNo: "12",
      city: "Ahmedabad",
      state: "Gujarat",
      profession: "Retired",
      maritalStatus: "Married",
    },
    {
      id: "7702",
      name: "Aarav Ketan Shah",
      age: "76",
      profileImage: "/mainprofile.png",
      kutumbhNo: "7702",
      pageNo: "34",
      city: "Rajkot",
      state: "Gujarat",
      profession: "Businessman",
      maritalStatus: "Married",
    },
    {
      id: "1036",
      name: "Ramanlal Chhagan Shah",
      age: "58",
      profileImage: "/mainprofile.png",
      kutumbhNo: "1036",
      pageNo: "78",
      city: "Surat",
      state: "Gujarat",
      profession: "Trader",
      maritalStatus: "Married",
    },
    {
      id: "5672",
      name: "Priya Amit Shah",
      age: "29",
      profileImage: "/mainprofile.png",
      kutumbhNo: "5672",
      pageNo: "56",
      city: "Chennai",
      state: "Tamil Nadu",
      profession: "Teacher",
      maritalStatus: "Married",
    },
    {
      id: "8234",
      name: "Vikram Suresh Shah",
      age: "35",
      profileImage: "/mainprofile.png",
      kutumbhNo: "8234",
      pageNo: "89",
      city: "Hyderabad",
      state: "Telangana",
      profession: "Architect",
      maritalStatus: "Married",
    },
    {
      id: "2198",
      name: "Meera Rajesh Shah",
      age: "45",
      profileImage: "/mainprofile.png",
      kutumbhNo: "2198",
      pageNo: "23",
      city: "Kolkata",
      state: "West Bengal",
      profession: "Lawyer",
      maritalStatus: "Married",
    },
  ],
};
