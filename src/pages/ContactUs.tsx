import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const contactData = {
  address: {
    name: "Shri Modh Visa Gowbhja Sajna",

    wing: "No. 4, 4-334",
    street: "Gujarathi Galli",
    area: "Inder Bagh,Koti",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
    phone: "040 24756326",
  },
};

export const ContactUs = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-4 sm:px-6 sm:py-8 text-[#3D2B1F] flex flex-col items-center justify-center gap-4">
      <div className="flex max-w-4xl justify-start w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-primary-600 transition-colors"
        >
          <IoArrowBack className="text-sm" />
          <span>Go Back</span>
        </button>
      </div>
      <div className="mx-auto max-w-4xl w-full">
        <div className="bg-[#EBE0C5] border border-[#BC9C2F] rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] min-h-[148px]">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7B6349]">
            Office Address
          </p>
          <div className="mt-5 space-y-3 text-sm text-[#382B20] sm:text-base">
            <div className="rounded-lg  px-4 py-4">
              <p>{contactData.address.name}</p>
              <p>{contactData.address.wing}</p>
              <p>{contactData.address.street}</p>
              <p>{contactData.address.area}</p>
              <p>
                {contactData.address.city}, {contactData.address.state} -{" "}
                {contactData.address.pincode}
              </p>
              <p className="mt-2 font-semibold">
                Phone: {contactData.address.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
