"use client";

import React, { useState } from "react";
import { X, Save, ChevronDown, AlertCircle, Loader2 } from "lucide-react";

interface DocumentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: number;
    title: string;
    document_type: string;
    language: "en" | "ar";
  } | null;
  onSave: (data: { language: "en" | "ar"; document_type: string }) => void;
  isLoading?: boolean;
  isRTL?: boolean;
}

const CONTRACT_TYPES = {
  EMPLOYMENT_CONTRACT: "Employment Contract",
  PARTNERSHIP_CONTRACT: "Partnership Contract",
  SERVICE_CONTRACT: "Service Contract",
  LEASE_CONTRACT: "Lease Contract",
  SALES_CONTRACT: "Sales Contract",
  LABOR_LAW: "Labor Law",
  COMMERCIAL_LAW: "Commercial Law",
  CIVIL_LAW: "Civil Law",
  OTHER: "Other",
} as const;

export function DocumentEditModal({ isOpen, onClose, document, onSave, isLoading, isRTL }: DocumentEditModalProps) {
  const [formData, setFormData] = useState<{
    language: "en" | "ar";
    document_type: string;
  }>({
    language: document?.language || "en",
    document_type: document?.document_type || "EMPLOYMENT_CONTRACT",
  });
  
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form data when document changes
  React.useEffect(() => {
    if (document) {
      setFormData({
        language: document.language,
        document_type: document.document_type,
      });
    }
  }, [document]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.language) {
      newErrors.language = isRTL ? "اللغة مطلوبة" : "Language is required";
    }

    if (!formData.document_type) {
      newErrors.document_type = isRTL ? "نوع العقد مطلوب" : "Contract type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
    // Reset form to original values
    if (document) {
      setFormData({
        language: document.language,
        document_type: document.document_type,
      });
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? "تعديل المستند" : "Edit Document"}
            </h2>
            <p className="text-sm text-gray-500">{document.title}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "🌐 اللغة:" : "🌐 Language"}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={formData.language === "en"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value as "en" | "ar",
                    }))
                  }
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">🇬🇧 English</span>
              </label>
              <label className="focus:bg-gray-100 flex items-center">
                <input
                  type="radio"
                  name="language"
                  value="ar"
                  checked={formData.language === "ar"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value as "en" | "ar",
                    }))
                  }
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">🇸🇦 Arabic</span>
              </label>
            </div>
            {errors.language && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.language}
              </p>
            )}
          </div>

          {/* Contract Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "⚖️ نوع العقد:" : "⚖️ Contract Type"}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowContractDropdown(!showContractDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary flex items-center justify-between disabled:opacity-50"
                disabled={isLoading}
              >
                <span className="text-sm text-gray-700">
                  {CONTRACT_TYPES[formData.document_type as keyof typeof CONTRACT_TYPES] || formData.document_type}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    showContractDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showContractDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {Object.entries(CONTRACT_TYPES).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, document_type: key }));
                        setShowContractDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.document_type && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.document_type}
              </p>
            )}
          </div>

          {/* Current Document Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {isRTL ? "معلومات المستند الحالي" : "Current Document Info"}
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{isRTL ? "اسم الملف:" : "Filename:"} {document.title}</p>
              <p>{isRTL ? "اللغة الحالية:" : "Current Language:"} {document.language === "en" ? "🇬🇧 English" : "🇸🇦 Arabic"}</p>
              <p>{isRTL ? "نوع العقد الحالي:" : "Current Contract Type:"} {CONTRACT_TYPES[document.document_type as keyof typeof CONTRACT_TYPES]}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            disabled={isLoading}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 inline-flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isRTL ? "جاري الحفظ..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isRTL ? "حفظ التغييرات" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
