"use client";

import React, { useState } from "react";
import { X, ChevronDown, FileText, Scale } from "lucide-react";

interface UploadMetadata {
  documentCategory: string;
  lawName: string;
}

interface UploadMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metadata: UploadMetadata) => void;
  files: File[];
}

const DOCUMENT_CATEGORIES = {
  LAW: "Law",
  REGULATION: "Regulation", 
  CODE: "Code",
  DIRECTIVE: "Directive",
  DECREE: "Decree",
} as const;

export function UploadMetadataModal({
  isOpen,
  onClose,
  onSubmit,
  files,
}: UploadMetadataModalProps) {
  const [formData, setFormData] = useState<UploadMetadata>({
    documentCategory: "LAW",
    lawName: "",
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.documentCategory) {
      newErrors.documentCategory = "Document category is required";
    }

    if (!formData.lawName.trim()) {
      newErrors.lawName = "Law name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        documentCategory: "LAW",
        lawName: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  if (!isOpen) return null;

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
          <h2 className="text-lg font-semibold text-gray-900">
            Upload File Details
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Files Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Selected Files ({files.length}):
                </p>
              </div>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {files.map((file: File, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question 1: Document Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Scale className="h-4 w-4 inline mr-2" />
              What is the document category?
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary flex items-center justify-between"
              >
                <span className="text-sm text-gray-700">
                  {
                    DOCUMENT_CATEGORIES[
                      formData.documentCategory as keyof typeof DOCUMENT_CATEGORIES
                    ]
                  }
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    showCategoryDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, documentCategory: key }));
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.documentCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.documentCategory}</p>
            )}
          </div>

          {/* Question 2: Law Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              What is the name of the law?
            </label>
            <input
              type="text"
              value={formData.lawName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lawName: e.target.value }))
              }
              placeholder="Enter the name of the law..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.lawName && (
              <p className="mt-1 text-sm text-red-600">{errors.lawName}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}
