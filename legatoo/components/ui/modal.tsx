"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Image,
  FileSpreadsheet,
  Trash2,
  CheckCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Button } from "./button";

interface UploadedFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "completed" | "error";
  progress?: number;
}

interface LegalAnalysisData {
  analysisType: "case-analysis" | "contract-review" | "";
  lawsuitType: string;
  resultSeeking: string;
  files: UploadedFile[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: LegalAnalysisData) => void;
  isRTL?: boolean;
  type: "analysis" | "management";
}

export function Modal({
  isOpen,
  onClose,
  title,
  onSubmit,
  isRTL = false,
  type,
}: ModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LegalAnalysisData>({
    analysisType: "",
    lawsuitType: "",
    resultSeeking: "",
    files: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [showAnalysisTypeDropdown, setShowAnalysisTypeDropdown] =
    useState(false);
  const [showLawsuitTypeDropdown, setShowLawsuitTypeDropdown] =
    useState(false);
  const totalSteps = 3; // 2 form steps + 1 upload step

  // Analysis type options
  const analysisTypeOptions = [
    { value: "case-analysis", label: isRTL ? "تحليل القضية" : "Case Analysis" },
    {
      value: "contract-review",
      label: isRTL ? "مراجعة العقد" : "Contract Review",
    },
  ];

  // Lawsuit type options
  const lawsuitTypeOptions = [
    { value: "commercial", label: isRTL ? "تجاري" : "Commercial" },
    { value: "labor", label: isRTL ? "عمل" : "Labor" },
    { value: "personal-status", label: isRTL ? "أحوال شخصية" : "Personal Status" },
    { value: "criminal", label: isRTL ? "جنائي" : "Criminal" },
    { value: "civil", label: isRTL ? "مدني" : "Civil" },
    { value: "administrative", label: isRTL ? "إداري" : "Administrative" },
    { value: "contract-dispute", label: isRTL ? "نزاع عقود" : "Contract Dispute" },
    { value: "real-estate", label: isRTL ? "عقاري" : "Real Estate" },
    { value: "intellectual-property", label: isRTL ? "ملكية فكرية" : "Intellectual Property" },
    { value: "family", label: isRTL ? "أسري" : "Family" },
    { value: "employment", label: isRTL ? "توظيف" : "Employment" },
    { value: "other", label: isRTL ? "أخرى" : "Other" },
  ];

  // Supported file types
  const supportedFileTypes = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/msword": ".doc",
    "text/csv": ".csv",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return <Image className="h-5 w-5 text-green-600" />;
    } else if (fileType === "text/csv") {
      return <FileSpreadsheet className="h-5 w-5 text-orange-600" />;
    } else {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "uploading":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return isRTL ? "اكتمل التحليل" : "Analysis Complete";
      case "uploading":
        return isRTL ? "جاري الرفع" : "Uploading";
      case "error":
        return isRTL ? "خطأ في الرفع" : "Upload Error";
      default:
        return isRTL ? "في انتظار التحليل" : "Pending Analysis";
    }
  };

  const validateFile = (file: File): boolean => {
    return (
      Object.keys(supportedFileTypes).includes(file.type) ||
      Object.values(supportedFileTypes).some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      )
    );
  };

  const addFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    const invalidFiles = fileArray.filter((file) => !validateFile(file));

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        file: isRTL
          ? `نوع الملف غير مدعوم: ${invalidFiles.map((f) => f.name).join(", ")}`
          : `Unsupported file type: ${invalidFiles
              .map((f) => f.name)
              .join(", ")}`,
      }));
    }

    if (validFiles.length > 0) {
      const newUploadedFiles: UploadedFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: "pending" as const,
      }));

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleFormFieldChange = (
    field: keyof LegalAnalysisData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAnalysisTypeSelect = (
    value: "case-analysis" | "contract-review"
  ) => {
    setFormData((prev) => ({ ...prev, analysisType: value }));
    setShowAnalysisTypeDropdown(false);

    // Clear error for analysis type
    if (errors.analysisType) {
      setErrors((prev) => ({ ...prev, analysisType: undefined }));
    }
  };

  const handleLawsuitTypeSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, lawsuitType: value }));
    setShowLawsuitTypeDropdown(false);

    // Clear error for lawsuit type
    if (errors.lawsuitType) {
      setErrors((prev) => ({ ...prev, lawsuitType: undefined }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors: { [key: string]: string | undefined } = {};

    if (currentStep === 1) {
      // Step 1: Analysis Type
      if (!formData.analysisType) {
        newErrors.analysisType = isRTL
          ? "يرجى اختيار نوع التحليل"
          : "Please select analysis type";
      }
    } else if (currentStep === 2) {
      // Step 2: Lawsuit Type and Result Seeking
      if (!formData.lawsuitType.trim()) {
        newErrors.lawsuitType = isRTL
          ? "يرجى إدخال نوع الدعوى أو النزاع"
          : "Please enter lawsuit/dispute type";
      }
      if (!formData.resultSeeking.trim()) {
        newErrors.resultSeeking = isRTL
          ? "يرجى إدخال النتيجة المطلوبة"
          : "Please enter desired result";
      }
    } else if (currentStep === 3) {
      // Step 3: File upload
      if (uploadedFiles.length === 0) {
        newErrors.file = isRTL
          ? "يرجى رفع ملف واحد على الأقل"
          : "Please upload at least one file";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      onSubmit({ ...formData, files: uploadedFiles });
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      analysisType: "",
      lawsuitType: "",
      resultSeeking: "",
      files: [],
    });
    setUploadedFiles([]);
    setErrors({});
    setShowAnalysisTypeDropdown(false);
    setShowLawsuitTypeDropdown(false);
    onClose();
  };

  if (!isOpen) return null;

  const getStepTitle = () => {
    if (currentStep === 1) {
      return isRTL
        ? "نوع التحليل"
        : "Analysis Type";
    } else if (currentStep === 2) {
      return isRTL
        ? "تفاصيل الدعوى والنتيجة المطلوبة"
        : "Case Details & Desired Result";
    } else {
      return isRTL ? "رفع المستندات" : "Upload Documents";
    }
  };

  const getStepDescription = () => {
    if (currentStep === 1) {
      return isRTL
        ? "اختر نوع التحليل المطلوب"
        : "Select the required analysis type";
    } else if (currentStep === 2) {
      return isRTL
        ? "أدخل تفاصيل الدعوى أو النزاع والنتيجة التي تسعى لتحقيقها"
        : "Enter details about the lawsuit/dispute and the result you're seeking";
    } else {
      return isRTL
        ? "ارفع المستندات التي تريد تحليلها أو إدارتها"
        : "Upload the documents you want to analyze or manage";
    }
  };

  const renderFormStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6" style={{ position: 'relative', overflow: 'visible' }}>
          {/* Analysis Type */}
          <div className="relative" style={{ zIndex: 1 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "نوع التحليل" : "Type of Analysis"} *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowAnalysisTypeDropdown(!showAnalysisTypeDropdown)
                }
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  errors.analysisType ? "border-red-300  " : "border-gray-300  "
                } ${
                  isRTL ? "text-right" : "text-left"
                } flex items-center justify-between`}
              >
                <span
                  className={
                    formData.analysisType ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {formData.analysisType
                    ? analysisTypeOptions.find(
                        (opt) => opt.value === formData.analysisType
                      )?.label
                    : isRTL
                    ? "اختر نوع التحليل"
                    : "Select analysis type"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 ${
                    showAnalysisTypeDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showAnalysisTypeDropdown && (
                <div 
                  className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl"
                  style={{ zIndex: 10000 }}
                >
                  {analysisTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleAnalysisTypeSelect(
                          option.value as "case-analysis" | "contract-review"
                        )
                      }
                      className={`w-full px-3 py-2 text-left hover:bg-primary hover:text-white first:rounded-t-lg last:rounded-b-lg ${
                        formData.analysisType === option.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.analysisType && (
              <div
                className={`flex items-center mt-2 text-red-600 text-sm ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <AlertCircle className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                {errors.analysisType}
              </div>
            )}
          </div>
        </div>
      );
    } else if (currentStep === 2) {
      return (
        <div className="space-y-6">
          {/* Lawsuit Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "نوع الدعوى أو النزاع" : "Type of Lawsuit or Dispute"} *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowLawsuitTypeDropdown(!showLawsuitTypeDropdown)
                }
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  errors.lawsuitType ? "border-red-300  " : "border-gray-300  "
                } ${
                  isRTL ? "text-right" : "text-left"
                } flex items-center justify-between`}
              >
                <span
                  className={
                    formData.lawsuitType ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {formData.lawsuitType
                    ? lawsuitTypeOptions.find(
                        (opt) => opt.value === formData.lawsuitType
                      )?.label
                    : isRTL
                    ? "اختر نوع الدعوى أو النزاع"
                    : "Select lawsuit or dispute type"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 ${
                    showLawsuitTypeDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showLawsuitTypeDropdown && (
                <div 
                  className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto z-[10000]"
                  style={{ zIndex: 10000 }}
                >
                  {lawsuitTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleLawsuitTypeSelect(option.value)}
                      className={`w-full px-3 py-2 text-left hover:bg-primary hover:text-white first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        formData.lawsuitType === option.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-900"
                      } ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.lawsuitType && (
              <div
                className={`flex items-center mt-2 text-red-600 text-sm ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <AlertCircle className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                {errors.lawsuitType}
              </div>
            )}
          </div>

          {/* Result Seeking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? "النتيجة المطلوبة" : "Result You Are Seeking"} *
            </label>
            <textarea
              value={formData.resultSeeking}
              onChange={(e) =>
                handleFormFieldChange("resultSeeking", e.target.value)
              }
              placeholder={
                isRTL
                  ? "وصف مختصر للنتيجة المطلوبة"
                  : "Brief description of desired result"
              }
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg   transition-colors ${
                errors.resultSeeking ? "border-red-300  " : "border-gray-300  "
              } ${isRTL ? "text-right" : "text-left"}`}
            />
            {errors.resultSeeking && (
              <div
                className={`flex items-center mt-2 text-red-600 text-sm ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <AlertCircle className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                {errors.resultSeeking}
              </div>
            )}
          </div>

        </div>
      );
    }
    return null;
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isRTL ? "رفع المستندات" : "Upload Documents"}
        </label>
        <p className="text-sm text-gray-500 mb-4">
          {isRTL
            ? "ارفع مستنداتك القانونية. يمكنك إضافة المزيد من الملفات لاحقاً إذا احتجت لذلك."
            : "Upload your legal documents. You can add more files later if needed."}
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : errors.file
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload
            className={`mx-auto h-12 w-12 text-gray-400 ${
              dragActive ? "text-blue-400" : ""
            }`}
          />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {isRTL
                  ? "انقر لرفع ملفات أو اسحب الملفات هنا"
                  : "Click to upload files or drag and drop"}
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                {isRTL
                  ? "PDF, DOC, DOCX, CSV, الصور (حتى 10 ميجابايت لكل ملف)"
                  : "PDF, DOC, DOCX, CSV, Images (up to 10MB per file)"}
              </span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.gif,.webp"
              multiple
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {errors.file && (
          <div
            className={`flex items-center mt-2 text-red-600 text-sm ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <AlertCircle className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
            {errors.file}
          </div>
        )}
      </div>

      {/* Files List */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {isRTL ? "الملفات المرفوعة" : "Uploaded Files"}
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(uploadedFile.file)}
                  <div className={`${isRTL ? "text-right" : "text-left"}`}>
                    <div className="text-sm font-medium text-gray-900">
                      {uploadedFile.file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(uploadedFile.status)}
                    <span className="text-xs text-gray-600">
                      {getStatusText(uploadedFile.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Files Button */}
          <div className="mt-4 text-center">
            <label htmlFor="add-more-files" className="cursor-pointer">
              <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة المزيد من الملفات" : "Add More Files"}
              </div>
            </label>
            <input
              id="add-more-files"
              name="add-more-files"
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.gif,.webp"
              multiple
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50"
          onClick={handleClose}
        />

        <div
          className={`relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            isRTL ? "text-right" : "text-left"
          }`}
          style={{ overflowX: 'visible' }}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6  shadow${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  type === "analysis" ? "bg-purple-100" : "bg-blue-100"
                }`}
              >
                {type === "analysis" ? (
                  <FileText className="h-6 w-6 text-purple-600" />
                ) : (
                  <Upload className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <h2
                className={`text-xl font-semibold text-gray-900 ${
                  isRTL ? "mr-3" : "ml-3"
                }`}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Step Progress */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        i + 1 <= currentStep
                          ? type === "analysis"
                            ? "bg-primary  text-white"
                            : "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          i + 1 < currentStep
                            ? type === "analysis"
                              ? "bg-primary"
                              : "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-visible">
            {/* Step Title and Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getStepTitle()}
              </h3>
              <p className="text-sm text-gray-500">{getStepDescription()}</p>
            </div>

            {/* Step Content */}
            <div className="overflow-visible">
              {currentStep <= 2 ? renderFormStep() : renderUploadStep()}
            </div>
          </div>

          {/* Footer */}
          <div className="shadow w-full p-1"></div>
          <div
            className={`flex items-center justify-between p-6  ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Previous Button */}
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className={`px-6 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <ChevronLeft
                    className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                  />
                  {isRTL ? "السابق" : "Previous"}
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className={`flex items-center space-x-3 ${
                isRTL ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Button variant="outline" onClick={handleClose} className="px-6">
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className={`px-6 ${
                    type === "analysis"
                      ? "bg-primary hover:bg-primary/40"
                      : "bg-blue-600 hover:bg-blue-700"
                  } ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {isRTL ? "التالي" : "Next"}
                  <ChevronRight
                    className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`}
                  />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className={`px-6 ${
                    type === "analysis"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isRTL ? "بدء التحليل" : "Start Analysis"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
