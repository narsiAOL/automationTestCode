import React from "react";

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
  spinnerClassName?: string;
  containerClassName?: string;
}

const Loader: React.FC<LoaderProps> = ({
  message,
  fullScreen = false,
  spinnerClassName = "",
  containerClassName = "",
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-background  z-50"
    : "flex items-center justify-center w-full h-full";

  return (
    <div className={containerClasses + " " + containerClassName}>
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 border-[3.1px] border-primary-100 border-t-primary-400 rounded-full animate-spin ${spinnerClassName}`}
        ></div>
        {message && (
          <p className="mt-4 text-heading-6 text-primary-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
