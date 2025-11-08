"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface LawDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  lawData: {
    id: number;
    name: string;
    type?: string;
    articles_count?: number;
    chunks_count?: number;
  } | null;
  isLoading?: boolean;
  isRTL?: boolean;
}

export function LawDeleteModal({
  isOpen,
  onClose,
  onDelete,
  lawData,
  isLoading = false,
  isRTL = false,
}: LawDeleteModalProps) {
  if (!isOpen || !lawData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}>
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

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            {isRTL
              ? "هل أنت متأكد من حذف القانون:"
              : "Are you sure you want to delete:"}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-900 mb-1">
              &quot;{lawData.name}&quot;
            </p>
            {lawData.type && (
              <p className="text-xs text-gray-500 mb-2">
                {isRTL ? "النوع: " : "Type: "}
                {lawData.type}
              </p>
            )}
          </div>

          {/* Deletion Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "سيتم حذف:" : "This will delete:"}
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• {isRTL ? "جميع المواد" : "All articles"}
                {lawData.articles_count !== undefined && ` (${lawData.articles_count} ${isRTL ? "مادة" : "articles"})`}
              </li>
              <li>• {isRTL ? "جميع البيانات المرتبطة" : "All related data"}</li>
              <li>• {isRTL ? "محتوى قاعدة البيانات" : "Database content"}
                {lawData.chunks_count !== undefined && ` (${lawData.chunks_count} ${isRTL ? "قطعة" : "chunks"})`}
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-yellow-800">
              ⚠️ {isRTL ? "لا يمكن التراجع عن هذا الإجراء!" : "This action cannot be undone!"}
            </p>
          </div>

          {/* Actions */}
          <div className={`flex items-center justify-end space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading
                ? (isRTL ? "جاري الحذف..." : "Deleting...")
                : (isRTL ? "حذف نهائياً" : "Delete Forever")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

