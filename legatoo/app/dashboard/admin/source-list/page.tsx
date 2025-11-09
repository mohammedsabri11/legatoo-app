"use client";

import React, { useState, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import {
  useStartTraining,
  useLaws,
  useLawsUpload,
  useLawTree,
  useDeleteLaw,
} from "@/hooks/useDocumentUpload";
import { UploadMetadataModal } from "@/components/admin/upload-metadata-modal";
import { DocumentViewModal } from "@/components/admin/document-view-modal";
import { StatusBadge } from "@/components/admin/status-badge";
import { LawDeleteModal } from "@/components/admin/law-delete-modal";
import { TrainingModal } from "@/components/admin/training-modal";
import {
  Upload,
  AlertCircle,
  Plus,
  Brain,
  Eye,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

interface UploadedFile {
  id: string;
  file: File;
  status: "uploading" | "completed" | "error" | "processing";
  progress: number;
  metadata?: {
    documentCategory: string;
    lawName: string;
  };
  analysis?: {
    type: string;
    confidence: number;
    keyPoints: string[];
  };
}

interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ComponentType<{ className?: string }>;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  titleAr: string;
  subtitles: Subtitle[];
}

interface Subtitle {
  id: string;
  title: string;
  titleAr: string;
  documents: Document[];
}

interface Document {
  id: string;
  title: string;
  type: string;
  language: "en" | "ar";
  status: "pending" | "processing" | "done" | "error";
  chunks: number;
  uploadedAt: string;
}

export default function AdminSourceListPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const trainingMutation = useStartTraining();
  const deleteLawMutation = useDeleteLaw();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  
  const lawsQuery = useLaws({
    page: currentPage,
    page_size: pageSize,
    search: searchTerm || undefined,
  });
  const lawsUploadMutation = useLawsUpload();

  // Track law statuses locally (for optimistic UI updates)
  const [lawStatuses, setLawStatuses] = useState<Record<number, "raw" | "processing" | "processed" | "indexed">>({});

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedLawId, setSelectedLawId] = useState<number | null>(null);
  const [lawToDelete, setLawToDelete] = useState<{
    id: number;
    name: string;
    type?: string;
    articles_count?: number;
    chunks_count?: number;
  } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: number;
    title: string;
    document_type: string;
    language: "en" | "ar";
    uploaded_by_id: number;
    created_at: string;
    processing_status: "pending" | "processing" | "done" | "error";
    is_processed: boolean;
    notes: string;
    file_path: string;
    chunks_count: number;
  } | null>(null);

  // Law tree query
  const lawTreeQuery = useLawTree(selectedLawId || undefined);

  // Transform API data to categories format
  const categories: Category[] = lawsQuery.data?.laws
    ? lawsQuery.data.laws.map((law) => ({
        id: law.id.toString(),
        name: law.name,
        nameAr: law.name, // Assuming the API returns Arabic names
        icon: BookOpen,
        chapters: [
          {
            id: `${law.id}-main`,
            title: "Main Content",
            titleAr: "المحتوى الرئيسي",
            subtitles: [
              {
                id: `${law.id}-content`,
                title: "Law Content",
                titleAr: "محتوى القانون",
                documents: [
                  {
                    id: law.id.toString(),
                    title: law.name,
                    type: law.type.toUpperCase(),
                    language: "ar", // Assuming Arabic laws
                    status: law.status === "processed" ? "done" : "processing",
                    chunks: 0, // Will be updated when we have chunk data
                    uploadedAt: law.created_at.split("T")[0],
                  },
                ],
              },
            ],
          },
        ],
      }))
    : [];

  // Helper function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return isRTL ? "غير محدد" : "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const processFilesWithMetadata = useCallback(
    (metadata: { documentCategory: string; lawName: string }) => {
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

      // Call the laws upload API
      lawsUploadMutation.mutate(
        {
          pdf_file: pendingFiles,
          law_name: metadata.lawName,
          law_type: metadata.documentCategory.toLowerCase(),
        },
        {
          onSuccess: (response) => {
            console.log("Laws upload response:", response);
            if (response.success && response.data) {
              setUploadedFiles((prev) =>
                prev.map((file) => ({
                  ...file,
                  status: "completed" as const,
                  progress: 100,
                }))
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
        }
      );
    },
    [pendingFiles, lawsUploadMutation]
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const maxSize = 2 * 1024 * 1024; // 2MB
      const maxFiles = 10;
      const supportedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/csv",
        "application/json",
        "text/json"
      ];

      // Check file count limit
      if (fileArray.length > maxFiles) {
        toast.error(
          isRTL
            ? `يمكن رفع ${maxFiles} ملفات كحد أقصى`
            : `You can upload a maximum of ${maxFiles} files at once.`
        );
        return;
      }

      const validFiles = fileArray.filter((file) => {
        if (file.size > maxSize) {
          toast.error(
            isRTL
              ? `حجم الملف ${file.name} كبير جداً (الحد الأقصى 2MB)`
              : `File ${file.name} is too large (maximum size is 2MB).`
          );
          return false;
        }
        if (!supportedTypes.includes(file.type)) {
          toast.error(
            isRTL
              ? `نوع الملف ${file.name} غير مدعوم`
              : `File type ${file.name} is not supported.`
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
    // Open the training modal (frontend simulation)
    setShowTrainingModal(true);
    // Note: The actual API call is replaced with frontend simulation
    // trainingMutation.mutate();
  };

  const handleViewCategory = (category: Category) => {
    // Extract law ID from category
    const lawId = parseInt(category.id);
    setSelectedLawId(lawId);

    // Set a mock document for the modal to show the category hierarchy
    setSelectedDocument({
      id: lawId,
      title: isRTL ? category.nameAr : category.name,
      document_type: "law",
      language: "ar", // Assuming Arabic laws
      uploaded_by_id: 1,
      created_at: new Date().toISOString(),
      processing_status: "done",
      is_processed: true,
      notes: "",
      file_path: "",
      chunks_count: 0,
    });
    setShowViewModal(true);
  };

  const handleCloseModals = () => {
    setShowViewModal(false);
    setSelectedDocument(null);
    setSelectedLawId(null);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (lawId: number, newStatus: "raw" | "processing" | "processed" | "indexed") => {
    setLawStatuses(prev => ({
      ...prev,
      [lawId]: newStatus
    }));
  };

  const handleDeleteClick = (law: {
    id: number;
    name: string;
    type: string;
  }) => {
    setLawToDelete({
      id: law.id,
      name: law.name,
      type: law.type,
    });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!lawToDelete) return;

    deleteLawMutation.mutate(lawToDelete.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setLawToDelete(null);
        // The query will automatically refetch due to invalidation in the hook
      },
      onError: () => {
        // Error is already handled in the hook with toast
      },
    });
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setLawToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "قائمة المصادر" : "Source List"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "إدارة قائمة المصادر والمراجع القانونية"
                : "Manage source list and legal references"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={startTraining}
              disabled={
                trainingMutation.isPending ||
                lawsUploadMutation.isPending ||
                (uploadedFiles.length === 0 && lawsQuery.data?.laws?.length === 0)
              }
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
        <div className="bg-white rounded-lg Shadow p-6">
          {lawsUploadMutation.isPending ? (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {isRTL ? "جاري رفع الملفات..." : "Uploading files..."}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isRTL
                      ? "يرجى الانتظار بينما نقوم بمعالجة ملفاتك"
                      : "Please wait while we process your files"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
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
                  multiple
                  accept=".pdf,.docx,.doc,.csv,application/json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {isRTL
                        ? "اسحب وأفلت ملفات القوانين هنا"
                        : "Drag and drop law files here"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isRTL
                        ? "أو انقر للاختيار من جهازك"
                        : "or click to select from your device"}
                    </p>
                  </div>

                  <div className="text-xs text-gray-400">
                    {isRTL
                      ? "يدعم: PDF, DOCX, DOC, CSV, JSON | الحد الأقصى: 10 ملفات، 2MB لكل ملف"
                      : "Supports: PDF, DOCX, DOC, CSV, JSON | Max: 10 files, 2MB each"}
                  </div>
                </div>
              </div>

              {/* Add More Files Button */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إضافة ملفات قوانين أخرى" : "Add More Law Files"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Loading state for laws */}
        {lawsQuery.isLoading && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-sm text-gray-600">
                {isRTL ? "جاري تحميل القوانين..." : "Loading laws..."}
              </span>
            </div>
          </div>
        )}

        {/* Error state for laws */}
        {lawsQuery.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700">
                {isRTL ? "خطأ في تحميل القوانين" : "Error loading laws"}
              </span>
            </div>
          </div>
        )}

        {/* Categories Table */}
        {!lawsQuery.isLoading && !lawsQuery.isError && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h3 className="text-lg font-medium text-gray-900">
                  {isRTL ? "قائمة القوانين" : "Laws List"}
                </h3>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      isRTL ? "البحث في القوانين..." : "Search laws..."
                    }
                    className={`pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    value={searchTerm}
                  />
                  <div
                    className={`absolute inset-y-0 ${
                      isRTL ? "right-0 pr-3" : "left-0 pl-3"
                    } flex items-center pointer-events-none`}
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "اسم القانون" : "Law Name"}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "النوع" : "Type"}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "السلطة القضائية" : "Jurisdiction"}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "السلطة المصدرة" : "Issuing Authority"}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "تاريخ الإصدار" : "Issue Date"}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "تاريخ الإنشاء" : "Created Date"}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "الحالة" : "Status"}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "الإجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lawsQuery.data?.laws && lawsQuery.data.laws.length > 0 ? (
                    lawsQuery.data.laws.map((law) => {
                      return (
                        <tr key={law.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-primary/10 rounded-lg mr-3">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div className="text-sm font-medium w-32 truncate text-gray-900">
                                {law.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {law.type.toUpperCase()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {law.jurisdiction || (isRTL ? "غير محدد" : "Not specified")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {law.issuing_authority ? law.issuing_authority.slice(0, 20) : (isRTL ? "غير محدد" : "Not specified")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(law.issue_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(law.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge
                              status={lawStatuses[law.id] || law.status}
                              lawId={law.id}
                              documentId={law.id}
                              language={locale}
                              onStatusChange={(newStatus) => handleStatusChange(law.id, newStatus)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <button
                                onClick={() => handleViewCategory({
                                  id: law.id.toString(),
                                  name: law.name,
                                  nameAr: law.name,
                                  icon: BookOpen,
                                  chapters: []
                                })}
                                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              >
                                <Eye className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                                {isRTL ? "عرض" : "View"}
                              </button>
                              <button
                                onClick={() => handleDeleteClick(law)}
                                disabled={deleteLawMutation.isPending}
                                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                                {isRTL ? "حذف" : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center">
                        <div className="text-center">
                          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {isRTL
                              ? "لا توجد قوانين متاحة"
                              : "No laws available"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {isRTL
                              ? "لم يتم العثور على أي قوانين في النظام"
                              : "No laws found in the system"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {lawsQuery.data?.pagination && lawsQuery.data.pagination.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  {/* Pagination Info */}
                  <div className="text-sm text-gray-600">
                    {isRTL ? "عرض" : "Showing"}{" "}
                    <span className="font-medium">
                      {(lawsQuery.data.pagination.page - 1) * lawsQuery.data.pagination.page_size + 1}
                    </span>{" "}
                    {isRTL ? "إلى" : "to"}{" "}
                    <span className="font-medium">
                      {Math.min(
                        lawsQuery.data.pagination.page * lawsQuery.data.pagination.page_size,
                        lawsQuery.data.pagination.total
                      )}
                    </span>{" "}
                    {isRTL ? "من أصل" : "of"}{" "}
                    <span className="font-medium">{lawsQuery.data.pagination.total}</span>{" "}
                    {isRTL ? "نتيجة" : "results"}
                  </div>

                  {/* Page Size Selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {isRTL ? "عرض" : "Show"}{" "}
                    </span>
                    <select
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      {isRTL ? "لكل صفحة" : "per page"}
                    </span>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {isRTL ? "السابق" : "Previous"}
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, lawsQuery.data.pagination.total_pages) }, (_, i) => {
                        const startPage = Math.max(1, currentPage - 2);
                        const pageNumber = startPage + i;
                        
                        if (pageNumber > lawsQuery.data.pagination.total_pages) return null;
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              pageNumber === currentPage
                                ? "bg-primary text-white"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === lawsQuery.data.pagination.total_pages}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRTL ? "التالي" : "Next"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Metadata Modal */}
        {pendingFiles.length > 0 && (
          <UploadMetadataModal
            isOpen={showMetadataModal}
            onClose={closeMetadataModal}
            onSubmit={processFilesWithMetadata}
            files={pendingFiles}
          />
        )}

        {/* Document View Modal */}
        <DocumentViewModal
          isOpen={showViewModal}
          onClose={handleCloseModals}
          document={
            selectedDocument
              ? {
                  document: selectedDocument,
                  chunks: [],
                  statistics: {
                    total_chunks: 0,
                    chunks_with_embeddings: 0,
                    chunks_with_article_numbers: 0,
                    chunks_with_section_titles: 0,
                    keywords_extracted: 0,
                  },
                }
              : null
          }
          categories={categories}
          lawTreeData={lawTreeQuery.data}
          isRTL={isRTL}
        />

        {/* Law Delete Modal */}
        <LawDeleteModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onDelete={handleDeleteConfirm}
          lawData={lawToDelete}
          isLoading={deleteLawMutation.isPending}
          isRTL={isRTL}
        />

        {/* Training Modal */}
        <TrainingModal
          isOpen={showTrainingModal}
          onClose={() => setShowTrainingModal(false)}
          isRTL={isRTL}
        />
      </div>
    </DashboardLayout>
  );
}
