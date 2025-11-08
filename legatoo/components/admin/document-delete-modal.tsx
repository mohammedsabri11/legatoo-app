"use client";

import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface DocumentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  document: {
    title: string;
  } | null;
  isLoading?: boolean;
  isRTL?: boolean;
}

export function DocumentDeleteModal({ 
  isOpen, 
  onClose, 
  onDelete, 
  document, 
  isLoading, 
  isRTL 
}: DocumentDeleteModalProps) {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-start p-6 pb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isRTL 
                ? "هذا الإجراء لا يمكن التراجع عنه"
                : "This action cannot be undone"
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <Trash2 className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  {isRTL ? "هل أنت متأكد من حذف هذا المستند؟" : "Are you sure you want to delete this document?"}
                </h4>
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-medium">
                    {isRTL ? "اسم الملف:" : "Filename:"} {document.title}
                  </p>
                  <p className="mt-1">
                    {isRTL 
                      ? "سيتم حذف المستند وجميع البيانات المرتبطة به نهائياً من النظام."
                      : "The document and all its associated data will be permanently deleted from the system."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consequences List */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {isRTL ? "سيتم حذف:" : "What will be deleted:"}
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                {isRTL ? "الملف الأصلي" : "The original file"}
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                {isRTL ? "نتائج التحليل" : "Analysis results"}
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                {isRTL ? "معلومات المستند" : "Document metadata"}
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                {isRTL ? "سجل العمليات" : "Operation logs"}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            disabled={isLoading}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 inline-flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isRTL ? "جاري الحذف..." : "Deleting..."}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {isRTL ? "حذف بشكل نهائي" : "Delete Permanently"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
