import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const ChildSafety = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="flex flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors cursor-pointer"
        >
          <IoArrowBack className="text-base" />
          Back
        </button>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="space-y-8 text-slate-800">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
                Child Safety Standards
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Shri Modh Visa Gowbhuja Sajna Family Tree App
              </h1>
              <p className="text-base leading-8 text-slate-700 sm:text-lg">
                We are committed to maintaining a safe environment for all users
                and families. Child safety is a top priority, and we have zero
                tolerance for abuse, exploitation, or harmful behavior involving
                minors.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">
                Platform Management
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>
                  All profiles and application content are managed by the
                  authorized admin team.
                </li>
                <li>
                  Users cannot publicly upload, publish, or manage content
                  independently.
                </li>
                <li>
                  Content updates, edits, and deletions are handled only through
                  authorized administrative access.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">
                Safety Measures
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4 text-base leading-7 text-slate-700">
                <li>
                  All content is reviewed and managed internally by the admin
                  team.
                </li>
                <li>
                  Inappropriate or harmful content is strictly prohibited.
                </li>
                <li>
                  Accounts or content violating safety policies may be removed
                  immediately.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">
                Contact
              </h2>
              <p className="leading-7 text-slate-700">
                For child safety concerns or policy-related questions, please
                contact our team at:
              </p>
              <a
                href="https://modhvphyd.com/contact"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100"
              >
                modhvphyd.com/contact
              </a>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">
                Compliance
              </h2>
              <p className="leading-7 text-slate-700">
                Shri Modh Visa Gowbhuja Sajna Family Tree App complies with
                Google Play Child Safety Standards and applicable child safety
                regulations.
              </p>
            </section>

            <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Zero Tolerance Policy
              </h3>
              <p className="leading-7 text-slate-700">
                We do not allow any content or behavior that involves child
                sexual abuse, exploitation, or other forms of harm to minors.
                Our platform exists to preserve family heritage in a respectful
                and secure way.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildSafety;
