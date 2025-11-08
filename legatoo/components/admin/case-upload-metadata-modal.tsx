"use client";

import React, { useState } from "react";
import { X, ChevronDown, FileText } from "lucide-react";

interface CaseUploadMetadata {
  title: string;
  case_number: string | null;
  description: string | null;
  jurisdiction: string | null;
  court_name: string | null;
  decision_date: string | null;
  case_type: string | null;
  court_level: string | null;
}

interface CaseUploadMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metadata: CaseUploadMetadata) => void;
  files: File[];
  isRTL?: boolean;
}

const CASE_TYPES = {
  CIVIL: "مدني",
  CRIMINAL: "جنائي", 
  COMMERCIAL: "تجاري",
  LABOR: "عمل",
  ADMINISTRATIVE: "إداري",
} as const;

const COURT_LEVELS = {
  PRIMARY: "ابتدائي",
  APPEAL: "استئناف",
  CASSATION: "تمييز",
  SUPREME: "عالي",
} as const;

export function CaseUploadMetadataModal({
  isOpen,
  onClose,
  onSubmit,
  files,
  isRTL = false,
}: CaseUploadMetadataModalProps) {
  const [formData, setFormData] = useState<CaseUploadMetadata>({
    title: "",
    case_number: null,
    description: null,
    jurisdiction: null,
    court_name: null,
    decision_date: null,
    case_type: null,
    court_level: null,
  });
  
  const [showCaseTypeDropdown, setShowCaseTypeDropdown] = useState(false);
  const [showCourtLevelDropdown, setShowCourtLevelDropdown] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = isRTL ? "عنوان القضية مطلوب" : "Case title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CaseUploadMetadata, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCaseTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, case_type: type }));
    setShowCaseTypeDropdown(false);
  };

  const handleCourtLevelSelect = (level: string) => {
    setFormData(prev => ({ ...prev, court_level: level }));
    setShowCourtLevelDropdown(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? "معلومات القضية" : "Case Information"}
              </h2>
              <p className="text-sm text-gray-500">
                {isRTL ? "أدخل تفاصيل القضية للملفات المرفوعة" : "Enter case details for uploaded files"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Files Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {isRTL ? "الملفات المرفوعة" : "Uploaded Files"}
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title - Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "عنوان القضية *" : "Case Title *"}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.title ? "border-red-300" : "border-gray-300"
              } ${isRTL ? "text-right" : "text-left"}`}
              placeholder={isRTL ? "أدخل عنوان القضية" : "Enter case title"}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Case Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "رقم القضية" : "Case Number"}
            </label>
            <input
              type="text"
              value={formData.case_number || ""}
              onChange={(e) => handleInputChange("case_number", e.target.value || null)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? "text-right" : "text-left"
              }`}
              placeholder={isRTL ? "رقم مرجع القضية (مثال: 123/2024)" : "Case reference number (e.g., 123/2024)"}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "وصف القضية" : "Case Description"}
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value || null)}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? "text-right" : "text-left"
              }`}
              placeholder={isRTL ? "وصف مختصر للقضية" : "Brief description of the case"}
            />
          </div>

          {/* Jurisdiction and Court Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "السلطة القضائية" : "Jurisdiction"}
              </label>
              <input
                type="text"
                value={formData.jurisdiction || ""}
                onChange={(e) => handleInputChange("jurisdiction", e.target.value || null)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={isRTL ? "السلطة القضائية (مثال: الرياض)" : "Legal jurisdiction (e.g., Riyadh)"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "اسم المحكمة" : "Court Name"}
              </label>
              <input
                type="text"
                value={formData.court_name || ""}
                onChange={(e) => handleInputChange("court_name", e.target.value || null)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={isRTL ? "اسم المحكمة" : "Name of the court"}
              />
            </div>
          </div>

          {/* Decision Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "تاريخ القرار" : "Decision Date"}
            </label>
            <input
              type="date"
              value={formData.decision_date || ""}
              onChange={(e) => handleInputChange("decision_date", e.target.value || null)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? "text-right" : "text-left"
              }`}
              placeholder={isRTL ? "تاريخ القرار (YYYY-MM-DD)" : "Date of decision (YYYY-MM-DD)"}
            />
          </div>

          {/* Case Type and Court Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "نوع القضية" : "Case Type"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCaseTypeDropdown(!showCaseTypeDropdown)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary flex items-center justify-between ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <span className={formData.case_type ? "text-gray-900" : "text-gray-500"}>
                    {formData.case_type || (isRTL ? "اختر نوع القضية: مدني، جنائي، تجاري، عمل، إداري" : "Type: مدني, جنائي, تجاري, عمل, إداري")}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showCaseTypeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {Object.entries(CASE_TYPES).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleCaseTypeSelect(value)}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                          formData.case_type === value ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "مستوى المحكمة" : "Court Level"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCourtLevelDropdown(!showCourtLevelDropdown)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary flex items-center justify-between ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <span className={formData.court_level ? "text-gray-900" : "text-gray-500"}>
                    {formData.court_level || (isRTL ? "اختر مستوى المحكمة" : "Select court level")}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showCourtLevelDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {Object.entries(COURT_LEVELS).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleCourtLevelSelect(value)}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                          formData.court_level === value ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isRTL ? "رفع الملفات" : "Upload Files"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
