import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import FormTextarea from "../ui/FormTextarea";
import FormFileInput from "../ui/FormFileInput";
import Button from "../ui/Button";
import { useDrawer, type FormField } from "../../contexts/DrawerContext";
import FormSearchInput from "../ui/FormSearchInput";

interface EditFormProps {
  onSave?: (
    data: Record<string, any>,
    fields: FormField[],
  ) => Promise<void> | void;
  saveButtonText?: string;
  errors?: Record<string, string>; // field-level errors from parent
  formError?: Record<string, string>; // general error message from parent
}

export default function EditForm({
  onSave,
  saveButtonText,
  errors: parentErrors,
  formError,
}: EditFormProps) {
  const { t } = useTranslation();
  const {
    formFields,
    updateField,
    updateFields,
    getFormData,
    closeDrawer,
    isLoading,
    error,
  } = useDrawer();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (fields: FormField[]): Record<string, string> => {
    const errors: Record<string, string> = {};
    fields.forEach((field) => {
      if (!field.value) return;
      if (field.type === "email") {
        if (!field.value.includes("@")) {
          errors[field.name] = t("validation.invalidEmail");
        }
      }
      if (field.type === "tel") {
        if (!/^[0-9+\-\s()]*$/.test(field.value)) {
          errors[field.name] = t("validation.invalidPhone");
        }
      }
    });
    return errors;
  };

  const handleSave = async () => {
    const errors = validate(formFields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    const formData = getFormData();
    if (onSave) {
      await onSave(formData, formFields);
    }
  };

  const renderField = (field: FormField) => {
    if (field.name === "person_id") return null;
    const errorMsg =
      fieldErrors[field.name] ||
      formError?.[field.name] ||
      parentErrors?.[field.name];
    switch (field.type) {
      case "search":
        return (
          <FormSearchInput
            key={field.name}
            label={field.label}
            value={field.value}
            onChange={(value) => updateField(field.name, value)}
            onSelectPerson={(personData) => updateFields(personData)}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMsg}
          />
        );
      case "select":
        return (
          <FormSelect
            key={field.name}
            label={field.label}
            value={field.value}
            onChange={(value) => updateField(field.name, value)}
            options={field.options || []}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMsg}
          />
        );
      case "textarea":
        return (
          <FormTextarea
            key={field.name}
            label={field.label}
            value={field.value}
            onChange={(value) => updateField(field.name, value)}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMsg}
          />
        );
      case "file":
        return (
          <FormFileInput
            key={field.name}
            label={field.label}
            value={field.value}
            onChange={(value, file) => updateField(field.name, value, file)}
            accept={field.accept}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMsg}
          />
        );
      default:
        return (
          <FormInput
            key={field.name}
            type={field.type}
            label={field.label}
            value={field.value}
            onChange={(value) => updateField(field.name, value)}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMsg}
          />
        );
    }
  };

  const groupDefinitions = [
    {
      title: t("dashboard.editForm.basicInformation", "Basic Information"),
      names: ["photo", "firstname", "lastname", "surname", "gender", "gothra"],
    },
    {
      title: t("dashboard.editForm.family", "Link a family to this person"),
      names: ["family_id"],
    },
    {
      title: t("dashboard.editForm.personalDetails", "Personal Details"),
      names: ["dob", "dod", "pob", "blood_group", "marriage_date", "education"],
    },
    {
      title: t("dashboard.editForm.address", "Address"),
      names: ["state", "city", "pincode", "country", "residentialAddress"],
    },
    {
      title: t("dashboard.editForm.contactInformation", "Contact Information"),
      names: ["email", "mobile", "whatsapp"],
    },
    {
      title: t("dashboard.editForm.additionalInformation", "Additional Info"),
      names: ["kutumbhNo", "pageNo"],
    },
  ];

  const topFields = formFields.filter(
    (field) =>
      (field.type === "search" || field.name === "type") &&
      field.name !== "person_id",
  );

  const groupedFormFields = groupDefinitions.map((group) => ({
    title: group.title,
    fields: formFields.filter(
      (field) => field.type !== "search" && group.names.includes(field.name),
    ),
  }));

  const remainingFields = formFields.filter(
    (field) =>
      field.name !== "person_id" &&
      field.type !== "search" &&
      field.name !== "type" &&
      !groupDefinitions.some((group) => group.names.includes(field.name)),
  );

  return (
    <div className="edit-form">
      <div className="edit-form-fields space-y-6">
        {topFields.length > 0 && (
          <div className="space-y-4">{topFields.map(renderField)}</div>
        )}
        {groupedFormFields.map(
          (section) =>
            section.fields.length > 0 && (
              <div key={section.title} className="space-y-4 ">
                <div className="space-y-2 bg-primary-100">
                  <h3 className="text-base font-semibold text-text-main px-2 pt-2">
                    {section.title}
                  </h3>
                  <div className="h-[2px] w-full bg-[#D8C5A8]" />
                </div>
                <div
                  className={`grid w-full gap-4  ${section.fields.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}
                >
                  {section.fields.map(renderField)}
                </div>
              </div>
            ),
        )}
        {remainingFields.length > 0 && (
          <div className="space-y-4 ">
            <div className="space-y-2 bg-primary-100">
              <h3 className="text-base font-semibold text-text-main px-2 pt-2">
                {t("dashboard.editForm.otherInformation", "Other Information")}
              </h3>
              <div className="h-[2px] w-full bg-[#D8C5A8]" />
            </div>
            <div
              className={`grid gap-4 ${remainingFields.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2 "}`}
            >
              {remainingFields.map(renderField)}
            </div>
          </div>
        )}
      </div>

      {/* Error Display — from drawer context (API errors) or parent formError prop */}
      {/* {(error || formError) && (
        <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <span className="text-sm">{formError || error}</span>
        </div>
      )} */}

      <div className="edit-form-actions bg-primary-100">
        <Button
          variant="outlined"
          onClick={closeDrawer}
          className={`edit-form-cancel-btn text-text-main h-10  ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {t("dashboard.profile.editForm.cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className={`edit-form-save-btn ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {isLoading
            ? t("dashboard.profile.editForm.saving")
            : saveButtonText || t("dashboard.profile.editForm.save")}
        </Button>
      </div>
    </div>
  );
}
