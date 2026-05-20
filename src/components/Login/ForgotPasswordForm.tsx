import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Button from "../ui/Button";
import OrnamentalFlower from "../ui/OrnamentalFlower";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = validateEmail(email);
    if (emailValidation !== "") {
      setEmailError(emailValidation);
      setShouldValidate(true);
      return;
    }

    // TODO: Implement forgot password logic
    console.log("Forgot password for:", email);
    setShouldValidate(false);
  };

  const handleCancel = () => {
    navigate("/login");
  };
  const validateEmail = (email: string): string => {
    if (!email) {
      return "Email is required";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };
  const handleEmailValidation = (isValid: boolean, _errorMessage: string) => {
    setEmailValid(isValid);
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-start w-full ">
      {/* Title with ornamental elements - matching LoginForm design */}
      <div className="flex items-center justify-center gap-3 w-full px-3 py-1">
        {/* Left ornamental flower */}
        <OrnamentalFlower />

        {/* Title */}
        <h1 className="text-heading-3 text-text-main text-center font-serif">
          {t("forgotPassword.title")}
        </h1>

        {/* Right ornamental flower */}
        <OrnamentalFlower />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 w-full max-w-[300px]"
      >
        {/* Email Input */}
        <Input
          type="email"
          label={t("login.emailLabel")}
          placeholder={t("login.emailPlaceholder")}
          value={email}
          error={emailError}
          setError={setEmailError}
          onChange={setEmail}
          onValidation={handleEmailValidation}
          shouldValidate={shouldValidate}
          required
        />

        {/* Buttons */}
        <div className="flex flex-col gap-2 items-center">
          {/* Continue Button */}
          <Button
            variant="primary"
            className="w-[210px] h-[52px]"
            onClick={handleSubmit}
          >
            {t("forgotPassword.continueButton")}
          </Button>

          {/* Cancel Link */}
          <button
            type="button"
            onClick={handleCancel}
            className="text-link-button text-[#29308f] hover:underline transition-all duration-200 cursor-pointer bg-transparent border-none focus:outline-none focus:underline"
          >
            {t("forgotPassword.cancelButton")}
          </button>
        </div>
      </form>
    </div>
  );
}
