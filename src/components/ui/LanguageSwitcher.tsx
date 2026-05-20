import { useTranslation } from "react-i18next";
import FormSelect from "./FormSelect";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
];

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({
  className = "",
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <FormSelect
      label={""}
      value={i18n.language}
      onChange={handleLanguageChange}
      options={languages.map((language) => ({
        value: language.code,
        label: language.nativeName,
      }))}
      placeholder="Select language"
      className={className}
      background="#111"
      textColor="#fff"
      borderRadius="40px"
    />
  );
}
