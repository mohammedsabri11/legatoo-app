"use client";

import React, { useState, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import { useCaseUpload, useCases, useCaseDetail, useUpdateCase, useDeleteCase, useStartTraining } from "@/hooks/useDocumentUpload";
import { CaseUploadMetadataModal } from "@/components/admin/case-upload-metadata-modal";
import { CaseViewModal } from "@/components/admin/case-view-modal";
import { CaseEditModal } from "@/components/admin/case-edit-modal";
import { CaseDeleteModal } from "@/components/admin/case-delete-modal";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Brain,
  Eye,
  Search,
  ChevronUp,
  ChevronDown,
  Edit3,
  Grid3X3,
  List,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UploadedFile {
  id: string;
  file: File;
  status: "uploading" | "completed" | "error" | "processing";
  progress: number;
  metadata?: {
    title: string;
    case_number: string | null;
    description: string | null;
    jurisdiction: string | null;
    court_name: string | null;
    decision_date: string | null;
    case_type: string | null;
    court_level: string | null;
  };
  analysis?: {
    type: string;
    confidence: number;
    keyPoints: string[];
  };
}

export default function AdminUploadPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // API hooks
  const uploadMutation = useCaseUpload();
  const casesQuery = useCases();
  const trainingMutation = useStartTraining()

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  
  // Table state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [contractTypeFilter, setContractTypeFilter] = useState("");
  const [courtLevelFilter, setCourtLevelFilter] = useState("");
  const [sortField, setSortField] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<{
    id: number;
    case_number: string | null;
    title: string;
    description: string | null;
    jurisdiction: string | null;
    court_name: string | null;
    decision_date: string | null;
    case_type: string | null;
    court_level: string | null;
    case_outcome: string | null;
    status: "raw" | "processed";
    document_id: number;
    created_at: string;
    updated_at?: string;
    sections?: Array<{
      id: number;
      section_type: string;
      content: string;
      created_at: string;
    }>;
    sections_count?: number;
    // Optional fields that might not be in all API responses
    involved_parties?: string | null;
    judge_names?: string | null;
    claim_amount?: number | null;
  } | null>(null);

  // CRUD hooks
  const updateCaseMutation = useUpdateCase();
  const deleteCaseMutation = useDeleteCase();
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);
  const caseDetailQuery = useCaseDetail(selectedCaseId);
  

  const processFilesWithMetadata = useCallback(
    (metadata: {
      title: string;
      case_number: string | null;
      description: string | null;
      jurisdiction: string | null;
      court_name: string | null;
      decision_date: string | null;
      case_type: string | null;
      court_level: string | null;
    }) => {
      if (pendingFiles.length === 0) return;

      // Add files to local state as "uploading"
      const newFiles: UploadedFile[] = pendingFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        metadata: metadata,
        status: "uploading" as const,
        progress: 0,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setPendingFiles([]);
      setShowMetadataModal(false);

      // Call the case upload API
      uploadMutation.mutate({
        file: pendingFiles[0], // Assuming single file for cases
        title: metadata.title,
        case_number: metadata.case_number,
        description: metadata.description,
        jurisdiction: metadata.jurisdiction,
        court_name: metadata.court_name,
        decision_date: metadata.decision_date,
        case_type: metadata.case_type,
        court_level: metadata.court_level,
      }, {
        onSuccess: (response) => {
          console.log(response);
          if (response.success && response.data) {
            // Update local files with API response
            setUploadedFiles((prev) =>
              prev.map((file, index) => {
                const apiFile = response.data?.uploaded_case;
                if (apiFile && index === 0) {
                  return {
                    ...file,
                    id: apiFile.id.toString(),
                    status: apiFile.status === "processed" ? "completed" : "processing",
                    progress: apiFile.status === "processed" ? 100 : 0,
                    analysis: undefined, // No analysis in API response
                  };
                }
                return file;
              })
            );
          }
        },
        onError: () => {
          // Update local files to error state
          setUploadedFiles((prev) =>
            prev.map((file) => ({
              ...file,
              status: "error" as const,
              progress: 0,
            }))
          );
        },
      });
    },
    [pendingFiles, uploadMutation]
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const maxSize = 10 * 1024 * 1024; // 10MB
      const maxFiles = 1; // Only allow one file at a time
      const supportedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/msword", // DOC
      ];

      // Check file count limit
      if (fileArray.length > maxFiles) {
        toast.error(
          isRTL
            ? "يمكن رفع ملف واحد فقط في كل مرة"
            : "Only one file can be uploaded at a time."
        );
        return;
      }

      const validFiles = fileArray.filter((file) => {
        if (file.size > maxSize) {
          toast.error(
            isRTL
              ? `حجم الملف ${file.name} كبير جداً (الحد الأقصى 10MB)`
              : `File ${file.name} is too large (maximum size is 10MB).`
          );
          return false;
        }
        if (!supportedTypes.includes(file.type)) {
          toast.error(
            isRTL
              ? `نوع الملف ${file.name} غير مدعوم. يرجى رفع ملف Word فقط (.docx أو .doc)`
              : `File type ${file.name} is not supported. Please upload Word files only (.docx or .doc).`
          );
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setPendingFiles(validFiles);
        setShowMetadataModal(true);
      }
    },
    [isRTL]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  // Check if user is admin
  const isAdmin = user?.role === "super_admin";

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? "غير مصرح لك بالوصول" : "Access Denied"}
            </h2>
            <p className="text-gray-600">
              {isRTL
                ? "تحتاج إلى صلاحيات المدير للوصول إلى هذه الصفحة"
                : "You need admin privileges to access this page"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "done":
      case "completed":
      case "processed":
        return CheckCircle;
      case "error":
        return AlertCircle;
      case "processing":
      case "raw":
        return Brain;
      default:
        return Clock;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };


  const closeMetadataModal = () => {
    setShowMetadataModal(false);
    setPendingFiles([]);
  };

  const startTraining = () => {
    trainingMutation.mutate();
  };

  // Table configuration
  const tableHeaders = [
    { key: "title", label: isRTL ? "عنوان القضية" : "Case Title" },
    { key: "case_number", label: isRTL ? "رقم القضية" : "Case Number" },
    { key: "case_type", label: isRTL ? "نوع القضية" : "Case Type" },
    { key: "court_level", label: isRTL ? "مستوى المحكمة" : "Court Level" },
    { key: "jurisdiction", label: isRTL ? "السلطة القضائية" : "Jurisdiction" },
    { key: "decision_date", label: isRTL ? "تاريخ القرار" : "Decision Date" },
    { key: "status", label: isRTL ? "الحالة" : "Status" },
    { key: "actions", label: isRTL ? "الإجراءات" : "Actions" },
  ];

  // Filtering and sorting logic
  const filteredCases = casesQuery.data?.data?.cases?.filter((caseItem) => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || caseItem.status === statusFilter;
    const matchesCaseType = !contractTypeFilter || caseItem.case_type === contractTypeFilter;
    const matchesCourtLevel = !courtLevelFilter || caseItem.court_level === courtLevelFilter;
    
    return matchesSearch && matchesStatus && matchesCaseType && matchesCourtLevel;
  }).sort((a, b) => {
    let aValue, bValue;
    
    if (sortField === "decision_date") {
      aValue = new Date(a.decision_date || "").getTime();
      bValue = new Date(b.decision_date || "").getTime();
    } else if (sortField === "title") {
      aValue = a.title || "";
      bValue = b.title || "";
    } else if (sortField === "case_number") {
      aValue = a.case_number || "";
      bValue = b.case_number || "";
    } else if (sortField === "case_type") {
      aValue = a.case_type || "";
      bValue = b.case_type || "";
    } else if (sortField === "court_level") {
      aValue = a.court_level || "";
      bValue = b.court_level || "";
    } else if (sortField === "jurisdiction") {
      aValue = a.jurisdiction || "";
      bValue = b.jurisdiction || "";
    } else if (sortField === "status") {
      aValue = a.status || "";
      bValue = b.status || "";
    } else {
      aValue = "";
      bValue = "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }) || [];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // CRUD Operations
  const handleViewCase = (caseItem: typeof filteredCases[0]) => {
    setSelectedCaseId(caseItem.id.toString());
    setShowViewModal(true);
  };

  const handleEditCase = (caseItem: typeof filteredCases[0]) => {
    setSelectedCase(caseItem);
    setShowEditModal(true);
  };

  const handleDeleteCase = (caseItem: typeof filteredCases[0]) => {
    setSelectedCase(caseItem);
    setShowDeleteModal(true);
  };

  const handleUpdateCase = (data: { 
    title?: string;
    case_number?: string | null;
    description?: string | null;
    jurisdiction?: string | null;
    court_name?: string | null;
    decision_date?: string | null;
    case_type?: string | null;
    court_level?: string | null;
  }) => {
    if (selectedCase) {
      updateCaseMutation.mutate({
        caseId: selectedCase.id,
        data: data,
      }, {
        onSuccess: () => {
          setShowEditModal(false);
          setSelectedCase(null);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCase) {
      deleteCaseMutation.mutate(selectedCase.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedCase(null);
        },
      });
    }
  };

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCase(null);
    setSelectedCaseId(undefined);
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "رفع المستندات" : "Upload case"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "رفع المستندات لتدريب نموذج الذكاء الاصطناعي"
                : "Upload documents to train the AI model"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={startTraining}
              disabled={trainingMutation.isPending || (uploadedFiles.length === 0 && casesQuery.data?.data?.cases?.length === 0)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {trainingMutation.isPending ? (
                <Brain className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              {isRTL ? "بدء التدريب" : "Start Training"}
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg Shadow p-6 relative">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.doc,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadMutation.isPending}
            />

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {isRTL
                    ? "اسحب وأفلت الملفات هنا"
                    : "Drag and drop files here"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isRTL
                    ? "أو انقر للاختيار من جهازك"
                    : "or click to select from your device"}
                </p>
              </div>

              <div className="text-xs text-gray-400">
                {isRTL
                  ? "يدعم: ملفات Word فقط (.docx, .doc) | الحد الأقصى: ملف واحد، 10MB"
                  : "Supports: Word files only (.docx, .doc) | Max: 1 file, 10MB"}
              </div>
            </div>
          </div>

          {/* Upload Loader Overlay */}
          {uploadMutation.isPending && (
            <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isRTL ? "جاري رفع الملف..." : "Uploading file..."}
                </h3>
                <p className="text-sm text-gray-500">
                  {isRTL 
                    ? "يرجى الانتظار، قد يستغرق هذا بضع ثوانٍ" 
                    : "Please wait, this may take a few seconds"}
                </p>
              </div>
            </div>
          )}

          {/* Add More Files Button */}
          {uploadedFiles.length > 0 && !uploadMutation.isPending && (
            <div className="mt-4 text-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة ملف آخر" : "Add Another File"}
              </button>
            </div>
          )}
        </div>

        {/* Loading state for cases */}
        {casesQuery.isLoading && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-sm text-gray-600">
                {isRTL ? "جاري تحميل القضايا..." : "Loading cases..."}
              </span>
            </div>
          </div>
        )}

        {/* Error state for cases */}
        {casesQuery.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700">
                {isRTL ? "خطأ في تحميل القضايا" : "Error loading cases"}
              </span>
            </div>
          </div>
        )}

        {/* Cases Table */}
        {casesQuery.data?.data?.cases && casesQuery.data.data.cases.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table Header with Search and Filters */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h3 className="text-lg font-medium text-gray-900">
                  {isRTL ? "القضايا المرفوعة سابقاً" : "Previously Uploaded Cases"}
                </h3>
                
                {/* View Toggle and Search/Filter Controls */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* View Toggle */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {isRTL ? "عرض:" : "View:"}
                    </span>
                    <div className="flex border border-gray-300 rounded-md">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          viewMode === "table"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        } ${isRTL ? "border-l" : "border-r"} border-gray-300`}
                        title={isRTL ? "عرض الجدول" : "Table View"}
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("card")}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          viewMode === "card"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        title={isRTL ? "عرض البطاقات" : "Card View"}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={isRTL ? "البحث في القضايا..." : "Search cases..."}
                      className={`pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                    />
                    <div className={`absolute inset-y-0 ${isRTL ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none`}>
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <option value="">{isRTL ? "جميع الحالات" : "All Status"}</option>
                    <option value="processed">{isRTL ? "مكتمل" : "Processed"}</option>
                    <option value="raw">{isRTL ? "خام" : "Raw"}</option>
                  </select>

                  {/* Case Type Filter */}
                  <select
                    value={contractTypeFilter}
                    onChange={(e) => setContractTypeFilter(e.target.value)}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <option value="">{isRTL ? "جميع الأنواع" : "All Types"}</option>
                    <option value="مدني">{isRTL ? "مدني" : "Civil"}</option>
                    <option value="جنائي">{isRTL ? "جنائي" : "Criminal"}</option>
                    <option value="تجاري">{isRTL ? "تجاري" : "Commercial"}</option>
                    <option value="عمل">{isRTL ? "عمل" : "Labor"}</option>
                    <option value="إداري">{isRTL ? "إداري" : "Administrative"}</option>
                  </select>

                  {/* Court Level Filter */}
                  <select
                    value={courtLevelFilter}
                    onChange={(e) => setCourtLevelFilter(e.target.value)}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <option value="">{isRTL ? "جميع المستويات" : "All Court Levels"}</option>
                    <option value="ابتدائي">{isRTL ? "أحكام المحاكم الابتدائية" : "First Instance Court Judgments"}</option>
                    <option value="استئناف">{isRTL ? "أحكام محاكم الاستئناف" : "Court of Appeal Rulings"}</option>
                    <option value="تمييز">{isRTL ? "أحكام محكمة التمييز" : "Supreme Court Rulings"}</option>
                    <option value="عالي">{isRTL ? "أحكام المحكمة العليا" : "High Court Rulings"}</option>
                  </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((header, index) => (
                        <th key={index} className="px-6 py-3">
                          <button
                            onClick={() => handleSort(header.key)}
                            className={`group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            {header.label}
                            {sortField === header.key && (
                              <span className="ml-2">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCases.map((caseItem) => {
                      const StatusIcon = getStatusIcon(caseItem.status);

                      return (
                        <tr key={caseItem.id} className="hover:bg-gray-50">
                          {/* Case Title */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <FileText className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className={`ml-3 ${isRTL ? "text-right mr-3 ml-0" : ""}`}>
                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {caseItem.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {caseItem.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Case Number */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {caseItem.case_number || 'N/A'}
                          </td>

                          {/* Case Type */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {caseItem.case_type || 'N/A'}
                            </span>
                          </td>

                          {/* Court Level */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {caseItem.court_level || 'N/A'}
                          </td>

                          {/* Jurisdiction */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {caseItem.jurisdiction || 'N/A'}
                          </td>

                          {/* Decision Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {caseItem.decision_date ? new Date(caseItem.decision_date).toLocaleDateString() : 'N/A'}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <StatusIcon
                                className={`h-4 w-4 mr-2 ${
                                  caseItem.status === "processed"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                                }`}
                              />
                              <span className="text-sm text-gray-600">
                                {caseItem.status === "processed" ? (isRTL ? "مكتمل" : "Processed") : (isRTL ? "خام" : "Raw")}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {/* View Button */}
                              <button 
                                onClick={() => handleViewCase(caseItem)}
                                className="text-primary hover:text-primary/80 transition-colors"
                                title={isRTL ? "عرض التفاصيل" : "View Details"}
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {/* Edit Button */}
                              <button 
                                onClick={() => handleEditCase(caseItem)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title={isRTL ? "تعديل القضية" : "Edit Case"}
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              {/* Delete Button */}
                              <button 
                                onClick={() => handleDeleteCase(caseItem)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title={isRTL ? "حذف القضية" : "Delete Case"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Card View */}
            {viewMode === "card" && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCases.map((caseItem) => {
                    const StatusIcon = getStatusIcon(caseItem.status);

                    return (
                      <div key={caseItem.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {/* Card Header */}
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <FileText className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {caseItem.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  ID: {caseItem.id}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <StatusIcon
                                className={`h-4 w-4 ${
                                  caseItem.status === "processed"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-3">
                          {/* Case Number */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              {isRTL ? "رقم القضية" : "Case Number"}
                            </span>
                            <span className="text-xs text-gray-900">
                              {caseItem.case_number || 'N/A'}
                            </span>
                          </div>

                          {/* Case Type */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              {isRTL ? "نوع القضية" : "Case Type"}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {caseItem.case_type || 'N/A'}
                            </span>
                          </div>

                          {/* Court Level */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              {isRTL ? "مستوى المحكمة" : "Court Level"}
                            </span>
                            <span className="text-xs text-gray-900">
                              {caseItem.court_level || 'N/A'}
                            </span>
                          </div>

                          {/* Jurisdiction */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              {isRTL ? "السلطة القضائية" : "Jurisdiction"}
                            </span>
                            <span className="text-xs text-gray-900">
                              {caseItem.jurisdiction || 'N/A'}
                            </span>
                          </div>

                          {/* Decision Date */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              {isRTL ? "تاريخ القرار" : "Decision Date"}
                            </span>
                            <span className="text-xs text-gray-900">
                              {caseItem.decision_date ? new Date(caseItem.decision_date).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>

                          {/* Status */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              {isRTL ? "الحالة" : "Status"}
                            </span>
                            <div className="flex items-center space-x-1">
                              <StatusIcon
                                className={`h-3 w-3 ${
                                  caseItem.status === "processed"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                                }`}
                              />
                              <span className="text-xs text-gray-600">
                                {caseItem.status === "processed" ? (isRTL ? "مكتمل" : "Processed") : (isRTL ? "خام" : "Raw")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <div className="flex items-center justify-end space-x-2">
                            {/* View Button */}
                            <button 
                              onClick={() => handleViewCase(caseItem)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5 rounded-md transition-colors"
                              title={isRTL ? "عرض التفاصيل" : "View Details"}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {isRTL ? "عرض" : "View"}
                            </button>

                            {/* Edit Button */}
                            <button 
                              onClick={() => handleEditCase(caseItem)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                              title={isRTL ? "تعديل القضية" : "Edit Case"}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              {isRTL ? "تعديل" : "Edit"}
                            </button>

                            {/* Delete Button */}
                            <button 
                              onClick={() => handleDeleteCase(caseItem)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                              title={isRTL ? "حذف القضية" : "Delete Case"}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              {isRTL ? "حذف" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredCases.length === 0 && (
              <div className="px-6 py-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {isRTL ? "لا توجد قضايا مطابقة" : "No matching cases"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isRTL 
                    ? "جرب تغيير معايير البحث أو المرشحات" 
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
              </div>
            )}

            {/* Pagination Info */}
            {casesQuery.data?.data?.cases && casesQuery.data.data.cases.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
                {isRTL ? "عرض" : "Showing"}{" "}
                <span className="font-medium">{filteredCases.length}</span>{" "}
                {isRTL ? "من أصل" : "of"}{" "}
                <span className="font-medium">{casesQuery.data.data.cases.length}</span>{" "}
                {isRTL ? "قضية" : "cases"}
              </div>
            )}
          </div>
        )}

        {/* Upload Metadata Modal */}
        {pendingFiles.length > 0 && (
          <CaseUploadMetadataModal
            isOpen={showMetadataModal}
            onClose={closeMetadataModal}
            onSubmit={processFilesWithMetadata}
            files={pendingFiles}
            isRTL={isRTL}
          />
        )}

          {/* Case View Modal */}
          <CaseViewModal 
            isOpen={showViewModal}
            onClose={handleCloseModals}
            caseData={caseDetailQuery.data?.data || selectedCase}
            isRTL={isRTL}
          />

        {/* Case Edit Modal */}
        <CaseEditModal
          isOpen={showEditModal}
          onClose={handleCloseModals}
          caseData={selectedCase}
          onSave={handleUpdateCase}
          isLoading={updateCaseMutation.isPending}
          isRTL={isRTL}
        />

        {/* Case Delete Modal */}
        <CaseDeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseModals}
          onDelete={handleDeleteConfirm}
          caseData={selectedCase}
          isLoading={deleteCaseMutation.isPending}
          isRTL={isRTL}
        />
      </div>
    </DashboardLayout>
  );
}