"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface CaseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: {
    id: number;
    title: string;
    case_number: string | null;
    description: string | null;
    jurisdiction: string | null;
    court_name: string | null;
    decision_date: string | null;
    case_type: string | null;
    court_level: string | null;
  } | null;
  onSave: (data: {
    title?: string;
    case_number?: string | null;
    description?: string | null;
    jurisdiction?: string | null;
    court_name?: string | null;
    decision_date?: string | null;
    case_type?: string | null;
    court_level?: string | null;
  }) => void;
  isLoading?: boolean;
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

export function CaseEditModal({
  isOpen,
  onClose,
  caseData,
  onSave,
  isLoading = false,
  isRTL = false,
}: CaseEditModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    case_number: "" as string,
    description: "" as string,
    jurisdiction: "" as string,
    court_name: "" as string,
    decision_date: "" as string,
    case_type: "" as string,
    court_level: "" as string,
  });

  const [showCaseTypeDropdown, setShowCaseTypeDropdown] = useState(false);
  const [showCourtLevelDropdown, setShowCourtLevelDropdown] = useState(false);

  useEffect(() => {
    if (caseData && isOpen) {
      setFormData({
        title: caseData.title || "",
        case_number: caseData.case_number || "",
        description: caseData.description || "",
        jurisdiction: caseData.jurisdiction || "",
        court_name: caseData.court_name || "",
        decision_date: caseData.decision_date || "",
        case_type: caseData.case_type || "",
        court_level: caseData.court_level || "",
      });
    }
  }, [caseData, isOpen]);

  if (!isOpen || !caseData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title || undefined,
      case_number: formData.case_number || null,
      description: formData.description || null,
      jurisdiction: formData.jurisdiction || null,
      court_name: formData.court_name || null,
      decision_date: formData.decision_date || null,
      case_type: formData.case_type || null,
      court_level: formData.court_level || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isRTL ? "تعديل القضية" : "Edit Case"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "عنوان القضية *" : "Case Title *"}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? "text-right" : "text-left"
              }`}
              required
            />
          </div>

          {/* Case Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "رقم القضية" : "Case Number"}
            </label>
            <input
              type="text"
              value={formData.case_number}
              onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? "text-right" : "text-left"
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "الوصف" : "Description"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? "text-right" : "text-left"
              }`}
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
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "اسم المحكمة" : "Court Name"}
              </label>
              <input
                type="text"
                value={formData.court_name}
                onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
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
              value={formData.decision_date}
              onChange={(e) => setFormData({ ...formData, decision_date: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? "text-right" : "text-left"
              }`}
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
                    {formData.case_type || (isRTL ? "اختر نوع القضية" : "Select case type")}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showCaseTypeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {Object.entries(CASE_TYPES).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, case_type: value });
                          setShowCaseTypeDropdown(false);
                        }}
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
                        onClick={() => {
                          setFormData({ ...formData, court_level: value });
                          setShowCourtLevelDropdown(false);
                        }}
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
              disabled={isLoading}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? (isRTL ? "جاري الحفظ..." : "Saving...")
                : (isRTL ? "حفظ التغييرات" : "Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

