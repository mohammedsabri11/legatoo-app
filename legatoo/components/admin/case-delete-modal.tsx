"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface CaseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  caseData: {
    id: number;
    title: string;
    case_number: string | null;
  } | null;
  isLoading?: boolean;
  isRTL?: boolean;
}

export function CaseDeleteModal({
  isOpen,
  onClose,
  onDelete,
  caseData,
  isLoading = false,
  isRTL = false,
}: CaseDeleteModalProps) {
  if (!isOpen || !caseData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            {isRTL
              ? "هل أنت متأكد أنك تريد حذف هذه القضية؟ لا يمكن التراجع عن هذا الإجراء."
              : "Are you sure you want to delete this case? This action cannot be undone."}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {caseData.title}
            </p>
            {caseData.case_number && (
              <p className="text-xs text-gray-500">
                {isRTL ? "رقم القضية: " : "Case Number: "}
                {caseData.case_number}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? (isRTL ? "جاري الحذف..." : "Deleting...")
                : (isRTL ? "حذف القضية" : "Delete Case")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

