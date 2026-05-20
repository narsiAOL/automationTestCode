import React from "react";

export default function ForgotPasswordLink({
  onClick,
  className,
  t,
}: {
  onClick: () => void;
  className?: string;
  t: (key: string) => string;
}) {
  return (
    <div className={"flex justify-center " + className}>
      <button
        type="button"
        onClick={onClick}
        className="text-link-button cursor-pointer text-text-link-blue hover:underline focus:outline-none focus:underline transition-colors duration-200"
      >
        {t("login.forgotPasswordLink")}
      </button>
    </div>
  );
}
