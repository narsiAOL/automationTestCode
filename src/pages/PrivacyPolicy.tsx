import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
const PrivacyPolicy = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="flex flex-col justify-center gap-3 items-center px-3 my-10 sm:px-4  ">
      <div className="flex max-w-4xl justify-start w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-primary-600 transition-colors"
        >
          <IoArrowBack className="text-sm" />
          <span>Go Back</span>
        </button>
      </div>
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        <div className="space-y-8 text-slate-700">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Privacy Policy – Shri Modh Visa Gowbhuja Sajna Family Tree Platform
          </h1>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              1. Privacy Policy for Member-Facing Website and Mobile Application
            </h2>
            <p className="text-base leading-8">
              This Privacy Policy describes how Shri Modh Visa Gowbhuja Sajna
              (“Society”, “we”, “our”, “us") collects, uses, stores, and
              protects personal information of its members through its website
              and mobile application (“Platform”). By accessing or using the
              Platform, you agree to the terms outlined in this Privacy Policy.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              2. Purpose and Scope
            </h2>
            <p className="leading-7">This Privacy Policy applies to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>All registered members of the society using the Platform.</li>
              <li>Visitors accessing public sections of the Platform.</li>
              <li>
                Data collected via website, mobile app, or related services.
              </li>
            </ul>
            <p className="leading-7">The purpose of this Platform is to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>Build and maintain a digital family tree of the society</li>
              <li>Enable community connection and communication</li>
              <li>Preserve family history, lineage, and relationships</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              3. Types of Personal Information We Collect
            </h2>
            <p className="leading-7">
              We collect only necessary information to operate the Platform
              effectively.
            </p>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                A. Personal Information
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Full Name</li>
                <li>Date of Birth</li>
                <li>Gender</li>
                <li>Contact details (Phone, Email)</li>
                <li>Profile photo</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                B. Family Information
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>
                  Relationship details (father, mother, spouse, children, etc.)
                </li>
                <li>Family lineage and connections</li>
                <li>Marital status</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                C. Business Information
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Business name</li>
                <li>Business type</li>
                <li>Location</li>
                <li>Contact details</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                D. Location Information
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Approximate location (city/state)</li>
                <li>Used for community segmentation and features</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                E. Technical / Automatic Data
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Device type and OS</li>
                <li>IP address</li>
                <li>Login timestamps</li>
                <li>Usage activity</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                F. Cookies &amp; Tracking
              </h3>
              <p className="leading-7">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Improve user experience</li>
                <li>Maintain sessions</li>
                <li>Analyze usage patterns</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              4. User Provided Information
            </h2>
            <p className="leading-7">Users voluntarily provide:</p>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                A. Family Details
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Family members’ names, relationships, and lineage</li>
                <li>Photos, stories, and historical data</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                B. Personal Details
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Contact information</li>
                <li>Profile details</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                C. Business Details
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>Business listings within the community</li>
              </ul>
            </div>

            <p className="leading-7">
              Users are responsible for ensuring that the data shared is
              accurate and consented to.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              5. How Shri Modh Visa Gowbhuja Sajna Uses Your Information
            </h2>
            <p className="leading-7">We use collected data to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>Build and display the family tree structure</li>
              <li>Enable member discovery and connections</li>
              <li>Maintain platform security</li>
              <li>Improve features and user experience</li>
            </ul>
            <p className="leading-7 text-slate-800 font-semibold">
              We do NOT sell, rent, or trade personal data to third parties.
            </p>
            <p className="leading-7">Information may be shared only:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>With authorized members within the platform</li>
              <li>When required by law</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              6. User Profile and Password
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>
                Each user is responsible for maintaining the confidentiality of
                their login credentials
              </li>
              <li>Users must not share passwords with others</li>
              <li>Any unauthorized access should be reported immediately</li>
              <li>
                We may suspend accounts in case of misuse or security concerns.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              7. Protection of Child Personal Information
            </h2>
            <p className="leading-7">
              The Platform may include limited data of minors (e.g., name,
              relationship) as part of the family tree.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>Children cannot independently create accounts</li>
              <li>Data is controlled by parents/guardians</li>
              <li>
                Only basic information is collected for relationship mapping
              </li>
              <li>
                We follow principles similar to global standards where
                children’s data is minimized and protected
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              8. Our Commitment to Data Security
            </h2>
            <p className="leading-7">
              We implement appropriate security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>Data encryption</li>
              <li>Secure servers and access controls</li>
              <li>Role-based data access</li>
              <li>Regular monitoring and audits</li>
            </ul>
            <p className="leading-7">
              Despite best efforts, no system is 100% secure. Users should
              exercise caution while sharing sensitive information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              9. Data Retention
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>Data is retained as long as the member account is active</li>
              <li>Users can request deletion of their data</li>
              <li>
                Some data may be retained for legal or operational purposes
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              10. User Rights
            </h2>
            <p className="leading-7">Members have the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
              <li>Access their data</li>
              <li>Update or correct information</li>
              <li>Request deletion</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="leading-7">
              Requests can be made via official contact channels of the society.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-700">
              11. Contact Information
            </h2>
            <p className="leading-7">
              For any privacy-related concerns, please contact:
            </p>
            <p className="text-base font-medium text-slate-800">
              Shri Modh Visa Gowbhuja Sajna Society
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
