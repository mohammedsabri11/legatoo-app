"use client";

import React, { useState } from "react";
import { X, Scale, FileText, Calendar, MapPin, Building, ChevronDown, ChevronUp } from "lucide-react";

interface CaseSection {
  id: number;
  section_type: string;
  content: string;
  created_at: string;
}

interface CaseData {
  id: number;
  case_number: string | null;
  title: string;
  description: string | null;
  jurisdiction: string | null;
  court_name: string | null;
  decision_date: string | null;
  case_type: string | null;
  court_level: string | null;
  case_outcome?: string | null;
  status: "raw" | "processed";
  document_id: number;
  created_at: string;
  updated_at?: string;
  sections?: CaseSection[];
  sections_count?: number;
  // Optional fields that might not be in all API responses
  involved_parties?: string | null;
  judge_names?: string | null;
  claim_amount?: number | null;
}

interface CaseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: CaseData | null;
  isRTL?: boolean;
}

const getSectionTitle = (sectionType: string, isRTL: boolean) => {
  const titles: Record<string, { en: string; ar: string }> = {
    summary: { en: "Case Summary", ar: "ملخص القضية" },
    facts: { en: "Facts", ar: "الوقائع" },
    arguments: { en: "Arguments", ar: "الحجج والدفوع" },
    ruling: { en: "Ruling", ar: "الحكم" },
    legal_basis: { en: "Legal Basis", ar: "الأساس القانوني" },
  };
  
  return titles[sectionType] 
    ? (isRTL ? titles[sectionType].ar : titles[sectionType].en)
    : (isRTL ? "قسم آخر" : "Other Section");
};

const getSectionIcon = (sectionType: string) => {
  switch (sectionType) {
    case "summary":
      return FileText;
    case "facts":
      return Calendar;
    case "arguments":
      return Scale;
    case "ruling":
      return Building;
    case "legal_basis":
      return MapPin;
    default:
      return FileText;
  }
};

export function CaseViewModal({
  isOpen,
  onClose,
  caseData,
  isRTL = false,
}: CaseViewModalProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  if (!isOpen || !caseData) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (caseData.sections) {
      setExpandedSections(new Set(caseData.sections.map(s => s.id)));
    }
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary rounded-lg shadow-md">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isRTL ? "تفاصيل القضية" : "Case Details"}
              </h2>
              <p className="text-sm text-gray-600">
                {isRTL ? `القضية رقم: ${caseData.case_number || caseData.id}` : `Case No: ${caseData.case_number || caseData.id}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Case Overview Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isRTL ? "معلومات القضية" : "Case Information"}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {isRTL ? "عنوان القضية" : "Case Title"}
                  </label>
                  <p className="text-sm font-medium text-gray-900">{caseData.title}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {isRTL ? "رقم القضية" : "Case Number"}
                  </label>
                  <p className="text-sm font-medium text-gray-900">{caseData.case_number || 'N/A'}</p>
                </div>
              </div>

              {/* Description */}
              {caseData.description && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {isRTL ? "الوصف" : "Description"}
                  </label>
                  <p className="text-sm text-gray-700">{caseData.description}</p>
                </div>
              )}

              {/* Court Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {isRTL ? "نوع القضية" : "Case Type"}
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {caseData.case_type || 'N/A'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {isRTL ? "مستوى المحكمة" : "Court Level"}
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {caseData.court_level || 'N/A'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {isRTL ? "الحالة" : "Status"}
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    caseData.status === "processed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {caseData.status === "processed" 
                      ? (isRTL ? "مكتمل" : "Processed") 
                      : (isRTL ? "خام" : "Raw")
                    }
                  </span>
                </div>
              </div>

              {/* Additional Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {caseData.jurisdiction && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                      {isRTL ? "السلطة القضائية" : "Jurisdiction"}
                    </label>
                    <p className="text-sm text-gray-900">{caseData.jurisdiction}</p>
                  </div>
                )}

                {caseData.court_name && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                      {isRTL ? "اسم المحكمة" : "Court Name"}
                    </label>
                    <p className="text-sm text-gray-900">{caseData.court_name}</p>
                  </div>
                )}

                {caseData.decision_date && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                      {isRTL ? "تاريخ القرار" : "Decision Date"}
                    </label>
                    <p className="text-sm text-gray-900">{formatDate(caseData.decision_date)}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    {isRTL ? "تاريخ الإنشاء" : "Created Date"}
                  </label>
                  <p className="text-sm text-gray-900">{formatDate(caseData.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Case Sections */}
          {caseData.sections && caseData.sections.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isRTL ? "أقسام القضية" : "Case Sections"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRTL ? `${caseData.sections_count || caseData.sections.length} أقسام` : `${caseData.sections_count || caseData.sections.length} sections`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={expandAll}
                    className="text-xs px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {isRTL ? "توسيع الكل" : "Expand All"}
                  </button>
                  <button
                    onClick={collapseAll}
                    className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    {isRTL ? "طي الكل" : "Collapse All"}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {caseData.sections.map((section) => {
                  const SectionIcon = getSectionIcon(section.section_type);
                  const isExpanded = expandedSections.has(section.id);

                  return (
                    <div key={section.id} className="bg-white">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <SectionIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {getSectionTitle(section.section_type, isRTL)}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {isRTL ? `${section.content.length} حرف` : `${section.content.length} characters`}
                            </p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-4">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed" dir={isRTL ? "rtl" : "ltr"}>
                              {section.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Sections Message */}
          {(!caseData.sections || caseData.sections.length === 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                {isRTL 
                  ? "لا توجد أقسام متاحة لهذه القضية حالياً" 
                  : "No sections available for this case yet"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            {isRTL ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
