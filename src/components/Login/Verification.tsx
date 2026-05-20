import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import VerificationCodeInput from "./VerificationCodeInput";
import OrnamentalFlower from "../ui/OrnamentalFlower";
import ForgotPasswordLink from "./ForgotPasswordLink";

interface VerificationProps {
  email?: string;
  onVerifyComplete?: (code: string) => void;
  onForgotPassword?: () => void;
}

export default function Verification({
  email = "jxxx@gmail.com",
  onVerifyComplete,
  onForgotPassword,
}: VerificationProps) {
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState("");

  const handleCodeComplete = (code: string) => {
    setVerificationCode(code);
  };

  const handleSignIn = () => {
    if (verificationCode.length === 6) {
      onVerifyComplete?.(verificationCode);
    }
  };

  const handleForgotPassword = () => {
    onForgotPassword?.();
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-start w-full  mx-auto">
      {/* Title Section */}
      <div className="flex flex-col gap-2 items-center justify-start w-full">
        <div className="flex gap-3 items-center justify-center">
          <OrnamentalFlower className="w-6 h-6 flex-shrink-0" />
          <h1 className="text-heading-3 text-text-main text-center">
            {t("verification.title")}
          </h1>
          <OrnamentalFlower className="w-6 h-6 flex-shrink-0" />
        </div>

        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-body-1 text-primary-600 text-center">
            {t("verification.emailSentMessage")}
          </p>
          <p className="text-body-2 text-text-main text-center break-all">
            {email}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-8 items-center justify-center w-full">
        <div className="flex flex-col gap-6 items-center justify-start w-full">
          {/* Verification Code Input */}
          <div className="flex flex-col gap-2 items-center justify-start w-full">
            <label className="text-label text-primary-600 text-center">
              {t("verification.codeLabel")}
            </label>
            <VerificationCodeInput
              length={6}
              onComplete={handleCodeComplete}
              onCodeChange={setVerificationCode}
              className="justify-center"
            />
          </div>

          {/* Forgot Password Link */}
          <ForgotPasswordLink onClick={handleForgotPassword} t={t} />
        </div>

        {/* Sign In Button */}
        <Button
          variant="primary"
          className="w-[210px] h-[52px]"
          onClick={handleSignIn}
        >
          {t("verification.signInButton")}
        </Button>
      </div>
    </div>
  );
}
