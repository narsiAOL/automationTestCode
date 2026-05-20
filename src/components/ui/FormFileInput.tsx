import React, { useEffect, useRef, useState } from "react";
import peopleService from "../../services/people";
import FallbackImage from "../../assets/svgs/fallback-image.svg";
import DeleteIcon from "./DeleteIcon";
import { useToast } from "../../hooks";

interface FormFileInputProps {
  label: string;
  value: string;
  onChange: (value: string, file?: File | Record<string, any> | null) => void;
  accept?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  error?: string;
}

const resolvePreviewUrl = (url: string): string => {
  if (!url) return "";

  // If already a full URL or data URL, return as-is
  if (
    /^https?:\/\//i.test(url) ||
    /^data:image\//i.test(url) ||
    /^blob:/i.test(url)
  ) {
    return url;
  }

  if (url.startsWith("/")) {
    // Get API base URL from environment
    const apiBase =
      import.meta.env.VITE_PUBLIC_API_URL?.trim().replace(/\/$/, "") || "";

    // Normalize the path - remove any existing /assets prefixes and add exactly one
    let normalizedPath = url;

    // Remove all existing /assets prefixes (including URL-encoded versions)
    normalizedPath = normalizedPath.replace(/\/assets(?:\/|$)/g, "/");
    normalizedPath = normalizedPath.replace(/\/assets%2F/g, "/");

    // Ensure we have exactly one /assets prefix
    if (!normalizedPath.startsWith("/assets/")) {
      normalizedPath = `/assets${normalizedPath}`;
    }

    if (apiBase) {
      return `${apiBase}${normalizedPath}`;
    }

    // Fallback: use window location origin if env var not available
    return `${window.location.origin}${normalizedPath}`;
  }

  return url;
};

export default function FormFileInput({
  label,
  value,
  onChange,
  accept = "image/*,audio/*",
  required = false,
  className = "",
  placeholder = "Choose file",
}: FormFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFileType, setSelectedFileType] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const { showError } = useToast();
  const isImageFile = (type: string) => type.startsWith("image/");
  const isImageUrl = (url: string) =>
    /^data:image\//i.test(url) || /\.(jpe?g|png|gif|webp|svg)$/i.test(url);

  useEffect(() => {
    if (!value) {
      setPreviewUrl("");
      return;
    }

    if (isImageFile(selectedFileType) || isImageUrl(value)) {
      if (previewUrl && /^https?:\/\//.test(previewUrl)) {
        return;
      }

      if (value.startsWith("data:image/")) {
        setPreviewUrl(value);
        return;
      }

      const resolvedUrl = resolvePreviewUrl(value);
      setPreviewUrl(resolvedUrl);
    } else {
      setPreviewUrl("");
    }
  }, [value, previewUrl, selectedFileType]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use accept prop to determine allowed file types
    const allowedTypes = accept.split(",").map((t) => t.trim());
    const isAllowed = allowedTypes.some(
      (type) =>
        file.type.startsWith(type.replace("/*", "/")) || type === file.type,
    );
    if (!isAllowed) {
      setUploadError(`Only files of type: ${accept} are supported.`);
      return;
    }

    setUploadError("");
    setIsUploading(true);
    setSelectedFileType(file.type);

    // Show immediate preview using FileReader only for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("container_name", "user_profile");

      const uploadResponse = await peopleService.uploadProfileImage(formData);

      // Extract relative URL and full URL from API response
      const uploadedFile = uploadResponse?.result?.[0];
      if (!uploadedFile) throw new Error("No uploaded file info found");

      const relativeUrl = uploadedFile.url;
      const fullUrl = uploadedFile.full_url;

      if (file.type.startsWith("image/")) {
        setPreviewUrl(fullUrl);
      } else {
        setPreviewUrl("");
      }
      onChange(relativeUrl, uploadedFile);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || "Failed to upload image");
      showError(err?.response?.data?.message || "Failed to upload file");
      console.error("Image upload failed:", err);
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl("");
    setSelectedFileType("");
  };

  const isImageField = accept.includes("image/") && !accept.includes("audio/");
  const isAudioField = accept.includes("audio/") && !accept.includes("image/");
  const defaultButtonText = isImageField
    ? "Photo"
    : isAudioField
      ? "File"
      : "File";
  const uploadingLabel = selectedFileType.startsWith("audio/")
    ? "file"
    : "image";
  const showImagePreview =
    !!previewUrl && (isImageFile(selectedFileType) || isImageUrl(previewUrl));

  const acceptedFormatsText = isImageField
    ? "Accepted formats: jpg, jpeg, png"
    : accept;

  return (
    <div className={`form-input-container ${className}`}>
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="file-input-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          required={required}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleButtonClick}
            className="file-input-button bg-primary-100 hover:bg-primary-200 text-primary-700 px-4 py-2 rounded-lg border border-primary-300 transition-colors cursor-pointer flex items-center gap-2"
          >
            {value
              ? `Change ${defaultButtonText}`
              : `Choose ${defaultButtonText}`}
          </button>

          {value && (
            <>
              <DeleteIcon onClick={handleRemoveFile} />
            </>
          )}

          {!value && (
            <span className="text-text-secondary text-sm">{placeholder}</span>
          )}
        </div>

        <div className="mt-2 text-xs text-[#6B5E4C]">{acceptedFormatsText}</div>

        {isUploading && (
          <div className="mt-3 text-sm text-primary-600">
            Uploading {uploadingLabel}...
          </div>
        )}

        {uploadError && (
          <div className="mt-3 text-sm text-red-600">{uploadError}</div>
        )}

        {showImagePreview && (
          <div className="mt-3">
            <div className="text-text-secondary text-sm mb-1">Preview:</div>
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
              <img
                src={previewUrl || FallbackImage}
                alt="Selected profile preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FallbackImage;
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
