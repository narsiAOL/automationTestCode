import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "select"
    | "textarea"
    | "file"
    | "search";
  value: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  accept?: string; // For file inputs
  file?: File | Record<string, any> | null;
  onChange?: (value: string, file?: File | Record<string, any> | null) => void; // Optional onChange for file inputs
}

interface DrawerContextType {
  isDrawerOpen: boolean;
  drawerTitle: string;
  formFields: FormField[];
  isLoading: boolean;
  error: string | null;
  openDrawer: (title: string, fields: FormField[]) => void;
  closeDrawer: () => void;
  updateField: (
    name: string,
    value: string,
    file?: File | Record<string, any> | null,
  ) => void;
  updateFields: (updates: Record<string, string>) => void;
  getFormData: () => Record<
    string,
    string | { value: string; file: File | Record<string, any> | null }
  >;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
}

interface DrawerProviderProps {
  children: ReactNode;
}

export function DrawerProvider({ children }: DrawerProviderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDrawer = (title: string, fields: FormField[]) => {
    setDrawerTitle(title);
    setFormFields(fields);
    setIsDrawerOpen(true);
    setError(null); // Clear any previous errors
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerTitle("");
    setFormFields([]);
    setError(null);
    setIsLoading(false);
  };

  const updateField = (
    name: string,
    value: string,
    file?: File | Record<string, any> | null,
  ) => {
    console.log("Updating field:", name, value, file);
    setFormFields((prev) =>
      prev.map((field) =>
        field.name === name
          ? { ...field, value, ...(file ? { file } : {}) }
          : field,
      ),
    );
  };

  const updateFields = (updates: Record<string, string>) => {
    setFormFields((prev) =>
      prev.map((field) =>
        Object.prototype.hasOwnProperty.call(updates, field.name)
          ? { ...field, value: updates[field.name] }
          : field,
      ),
    );
  };

  const getFormData = () => {
    return formFields.reduce(
      (acc, field) => {
        acc[field.name] =
          field.type === "file"
            ? { value: field.value, file: field.file ?? null }
            : field.value;
        return acc;
      },
      {} as Record<
        string,
        string | { value: string; file: File | Record<string, any> | null }
      >,
    );
  };

  const resetForm = () => {
    setFormFields((prev) => prev.map((field) => ({ ...field, value: "" })));
  };

  const value = {
    isDrawerOpen,
    drawerTitle,
    formFields,
    isLoading,
    error,
    openDrawer,
    closeDrawer,
    updateField,
    updateFields,
    getFormData,
    resetForm,
    setLoading: setIsLoading,
    setError,
  };

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}
