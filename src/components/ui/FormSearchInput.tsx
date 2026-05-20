import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import peopleService from "../../services/people";
import Loader from "./Loader";
import { mapAPIResponseToFormData } from "../../utils/formDataMapper";

interface FormSearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelectPerson: (personData: Record<string, string>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

export default function FormSearchInput({
  label,
  value,
  onChange,
  onSelectPerson,
  placeholder,
  required = false,
  className = "",
  error,
}: FormSearchInputProps) {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Ref to track if value was set by dropdown selection
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (skipNextSearchRef.current) {
        skipNextSearchRef.current = false;
        return;
      }
      if (value && value.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await peopleService.getPeople({
            search: value,
            page: 1,
            limit: 10,
            sort: "firstname",
            sortBy: "asc",
          });
          setSearchResults(results?.people || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const handleSelect = (person: any) => {
    // Set search field to the selected person's name
    const fullName = [person.firstname, person.lastname, person.surname]
      .filter(Boolean)
      .join(" ");
    skipNextSearchRef.current = true;
    onChange(fullName);
    const formData = mapAPIResponseToFormData(person);
    onSelectPerson(formData);
    setShowDropdown(false);
  };

  return (
    <div
      className={`form-input-container relative ${className}`}
      ref={dropdownRef}
    >
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="form-search-wrapper">
        <span className="form-search-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.25 19.25L15.5 15.5M17.75 10.125C17.75 14.3331 14.3331 17.75 10.125 17.75C5.91687 17.75 2.5 14.3331 2.5 10.125C2.5 5.91687 5.91687 2.5 10.125 2.5C14.3331 2.5 17.75 5.91687 17.75 10.125Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`form-input form-search-input${error ? " border-red-400" : ""}`}
          required={required}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader spinnerClassName="!w-4 !h-4" />
          </div>
        )}
      </div>

      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-50 top-full w-full mt-1 bg-white border border-[#9C845566] rounded-md shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {searchResults.map((person) => (
            <div
              key={person.id || person.person_id}
              className="px-4 py-3 hover:bg-[#F5EFE6] cursor-pointer flex items-center border-b border-[#9C845533] last:border-b-0 transition-colors"
              onClick={() => handleSelect(person)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#95511C]">
                  {[person.firstname, person.lastname, person.surname]
                    .filter(Boolean)
                    .join(" ")}
                </span>
                <span className="text-xs text-[#9C8455] mt-1">
                  {t(
                    "dashboard.profile.personalDetails.kutumbhNo",
                    "Kutumbh No",
                  )}
                  : {person.kutumb_number || "N/A"} •{" "}
                  {t("dashboard.profile.personalDetails.pageNo", "Page No")}:{" "}
                  {person.page_number || "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showDropdown &&
        value.length >= 2 &&
        !isSearching &&
        searchResults.length === 0 && (
          <div className="absolute z-1 left-0 top-full w-full mt-1 bg-white border border-[#9C845566] rounded-md shadow-lg p-4 text-center text-sm text-[#9C8455]">
            {t("member.errors.noPeopleFound", "No members found")}
          </div>
        )}
    </div>
  );
}
