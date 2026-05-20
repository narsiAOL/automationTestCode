import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input, Button } from "../ui";
import OrnamentalFlower from "../ui/OrnamentalFlower";
import ForgotPasswordLink from "./ForgotPasswordLink";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/svgs/Logo-header-1.svg";

interface LoginFormProps {
  onSubmit?: (email: string) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [shouldValidate, setShouldValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>();
  const [passwordError, setPasswordError] = useState<string | null>();

  const handleEmailValidation = (isValid: boolean, _errorMessage: string) => {
    setEmailValid(isValid);
  };

  const handlePasswordValidation = (
    isValid: boolean,
    _errorMessage: string,
  ) => {
    setPasswordValid(isValid);
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

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required";
    }
    if (password && password.length < 3) {
      return "Password must be at least 3 characters long";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Trigger validation on both fields
    // setShouldValidate(true);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    if (emailValidation !== "" && passwordValidation !== "") {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      return;
    } else if (emailValidation !== "") {
      setEmailError(emailValidation);
      return;
    } else if (passwordValidation !== "") {
      setPasswordError(passwordValidation);
      return;
    }

    // Check validation results after React state updates are processed
    if (email && password) {
      try {
        setIsLoading(true);

        // Use auth service to login
        await login({
          username: email,
          password,
          rememberMe: false, // You can add a checkbox for this later
        });

        // Only redirect back to a member-profile URL if that was the original location.
        const from = (location.state as any)?.from;
        const shouldRedirectToMemberProfile =
          from &&
          ((typeof from === "string" && from.includes("/member-profile")) ||
            (from.pathname && from.pathname.includes("/member-profile")));
        const redirectTo = shouldRedirectToMemberProfile
          ? from
          : { pathname: "/dashboard" };
        navigate(redirectTo, { replace: true });
        setIsLoading(false);

        // Call onSubmit if provided (for backward compatibility)
        // if (onSubmit) {
        //   onSubmit(email);
        // }
      } catch (error: any) {
        console.error("Login failed:", error);
        setError(error.response?.data?.message || t("login.loginFailed"));
        setIsLoading(false);
      }
    } else {
      console.log("Validation failed:", {
        emailValid,
        passwordValid,
        hasEmail: !!email,
        hasPassword: !!password,
      });
    }
    setShouldValidate(false);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col gap-6 items-center px-6 justify-start">
      {/* Logo */}

      <img
        src={Logo}
        alt="Logo"
        className="absolute top-0 left-4 w-32 h-auto z-10 object-contain"
        style={{ maxWidth: "120px", maxHeight: "60px" }}
      />

      {/* Title with ornamental icons */}
      <div className="flex items-center justify-center gap-3 w-full px-3 py-1">
        {/* Left ornamental icon placeholder */}
        <OrnamentalFlower />
        {/* Welcome Back text */}
        <h1 className="text-heading-3  text-text-main text-center font-serif">
          {t("login.label")}
        </h1>
        {/* Right ornamental icon placeholder */}
        <OrnamentalFlower />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-2">
            {error}
          </div>
        )}

        <div className="flex flex-col">
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

          {/* Password Input */}
          <Input
            type="password"
            label={t("login.passwordLabel")}
            placeholder={t("login.passwordPlaceholder")}
            value={password}
            onChange={setPassword}
            error={passwordError}
            setError={setPasswordError}
            onValidation={handlePasswordValidation}
            shouldValidate={shouldValidate}
            className="mt-2"
            required
          />

          {/* Forgot Password Link */}
          <ForgotPasswordLink
            onClick={handleForgotPassword}
            t={t}
            className="mt-6"
          />
        </div>

        {/* Sign In Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="primary"
            className={`w-[210px] h-[52px] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={isLoading ? undefined : handleSubmit}
          >
            {isLoading ? "Signing in..." : t("login.signInButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}
