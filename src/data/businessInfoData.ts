// Dummy data simulating /business-info API response
export interface BusinessInfoApiResponse {
  businessDetails: {
    name: string;
    address: string;
    email: string;
    mobile: string;
    whatsapp: string;
    website?: string;
    description?: string;
    establishedYear?: string;
    businessType?: string;
    profileImage?: string;
  };
  websiteDetails?: {
    websites: WebsiteInfo[];
  };
  advertisements?: {
    ads: AdInfo[];
  };
}

export interface WebsiteInfo {
  id: number;
  name: string;
  url: string;
  description?: string;
  category?: string;
}

export interface AdInfo {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  category?: string;
}

// Dummy business info data
export const dummyBusinessInfoData: BusinessInfoApiResponse = {
  businessDetails: {
    name: "Enterpi Tech Solutions",
    address:
      "14th Floor, C5, Orbit by Auro Realty, Knowledge City Rd, Silpa Gram Craft Village, Rai Durg, Hyderabad, Telangana 500019",
    email: "p.shah@gmail.com",
    mobile: "+91 02-2303-2030",
    whatsapp: "+91 02-2303-2030",
    website: "www.enterpritech.com",
    description:
      "Leading technology solutions provider specializing in enterprise software development and digital transformation.",
    establishedYear: "2010",
    businessType: "Technology Services",
    profileImage: "/mainprofile.png",
  },
  websiteDetails: {
    websites: [
      {
        id: 1,
        name: "Company Website",
        url: "https://www.enterpritech.com",
        description: "Main business website",
        category: "Business",
      },
      {
        id: 2,
        name: "LinkedIn Profile",
        url: "https://linkedin.com/company/enterpritech",
        description: "Professional networking",
        category: "Social",
      },
      {
        id: 3,
        name: "Portfolio",
        url: "https://portfolio.enterpritech.com",
        description: "Project showcase",
        category: "Portfolio",
      },
    ],
  },
  advertisements: {
    ads: [
      {
        id: 1,
        title: "Special Discount Offer",
        description: "Get 20% off on all our enterprise solutions this month!",
        imageUrl: "/mainprofile.png",
        link: "https://www.enterpritech.com/offers",
        category: "Promotion",
      },
      {
        id: 2,
        title: "New Service Launch",
        description: "Introducing our AI-powered business analytics platform.",
        imageUrl: "/mainprofile.png",
        link: "https://www.enterpritech.com/analytics",
        category: "Product",
      },
    ],
  },
};
