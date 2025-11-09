"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import { useDocuments, useStartTraining } from "@/hooks/useDocumentUpload";
import type {
  DocumentsQueryParams,
  KnowledgeDocumentSummary,
} from "@/lib/api/auth";
import {
  AlertCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Tag,
  User as UserIcon,
  X,
  XCircle,
} from "lucide-react";

const STATUS_LABELS = {
  processed: { en: "Processed", ar: "معالج" },
  processing: { en: "Processing", ar: "قيد المعالجة" },
  error: { en: "Error", ar: "خطأ" },
  raw: { en: "Pending", ar: "قيد الانتظار" },
  indexed: { en: "Indexed", ar: "مفهرس" },
};

const STATUS_STYLES: Record<string, string> = {
  processed: "bg-green-100 text-green-800 border border-green-200",
  processing: "bg-blue-100 text-blue-800 border border-blue-200",
  indexed: "bg-purple-100 text-purple-800 border border-purple-200",
  error: "bg-red-100 text-red-800 border border-red-200",
  raw: "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

function formatBytesToMb(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }
  if (value === 0) {
    return "0 MB";
  }
  const mb = value / (1024 * 1024);
  if (!Number.isFinite(mb)) {
    return "—";
  }
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }
  return `${(value / 1024).toFixed(2)} KB`;
}

function formatDate(value?: string | null, locale?: string): string {
  if (!value) {
    return "—";
  }
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString(locale === "ar" ? "ar-SA" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

function getStatusLabel(status: string, isRTL: boolean): string {
  const normalized = status.toLowerCase();
  const labels = STATUS_LABELS[normalized as keyof typeof STATUS_LABELS];
  if (!labels) {
    return status;
  }
  return isRTL ? labels.ar : labels.en;
}

function StatusPill({
  status,
  isRTL,
}: {
  status: string;
  isRTL: boolean;
}) {
  const normalized = status.toLowerCase();
  const classes =
    STATUS_STYLES[normalized] || "bg-gray-100 text-gray-800 border border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      {getStatusLabel(normalized, isRTL)}
    </span>
  );
}

function AnalysisSection({
  analysis,
  isRTL,
}: {
  analysis: KnowledgeDocumentSummary["analysis"];
  isRTL: boolean;
}) {
  if (!analysis || Object.keys(analysis).length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">
        {isRTL ? "تحليل الذكاء الاصطناعي" : "AI Analysis"}
      </h4>
      <div className="space-y-2 text-sm text-gray-700 max-h-64 overflow-y-auto">
        {Object.entries(analysis).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium text-gray-800">
              {isRTL ? key : key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
            </span>{" "}
            {(() => {
              if (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
              ) {
                return String(value);
              }
              if (Array.isArray(value)) {
                return value.join(", ");
              }
              return (
                <pre className="mt-1 rounded bg-gray-100 p-2 text-xs text-gray-700">
                  {JSON.stringify(value, null, 2)}
                </pre>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetadataSection({
  metadata,
  isRTL,
}: {
  metadata: KnowledgeDocumentSummary["metadata"];
  isRTL: boolean;
}) {
  const entries = Object.entries(metadata ?? {});
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">
        {isRTL ? "البيانات الوصفية" : "Metadata"}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 max-h-64 overflow-y-auto">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              {key}
            </p>
            <div className="text-gray-800 whitespace-pre-wrap break-words text-sm">
              {(() => {
                if (
                  typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                ) {
                  return String(value);
                }
                if (Array.isArray(value)) {
                  return value.join(", ");
                }
                return (
                  <pre className="mt-1 rounded bg-gray-100 p-2 text-xs text-gray-700">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentDetailsModal({
  document,
  onClose,
  locale,
  isRTL,
}: {
  document: KnowledgeDocumentSummary | null;
  onClose: () => void;
  locale: string;
  isRTL: boolean;
}) {
  if (!document) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? "تفاصيل المستند" : "Document Details"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{document.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isRTL ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-700">
            <div className="space-y-2">
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "الاسم الأصلي:" : "Original Filename:"}
                </span>{" "}
                {document.original_filename || "—"}
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "الفئة:" : "Category:"}
                </span>{" "}
                {document.category || (isRTL ? "غير مصنفة" : "Uncategorized")}
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "الحالة:" : "Status:"}
                </span>{" "}
                <StatusPill status={document.status_normalized || document.status} isRTL={isRTL} />
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "عدد الأجزاء:" : "Chunks:"}
                </span>{" "}
                {document.chunks_count ?? 0}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "حجم الملف:" : "File Size:"}
                </span>{" "}
                {formatBytesToMb(document.file_size_bytes)}
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "نوع الملف:" : "File Type:"}
                </span>{" "}
                {document.file_type || document.file_extension || "—"}
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "رفع بواسطة:" : "Uploaded By:"}
                </span>{" "}
                {document.uploaded_by_user?.email ||
                  (document.uploaded_by
                    ? `${isRTL ? "مستخدم #" : "User #"}${document.uploaded_by}`
                    : isRTL
                    ? "غير معروف"
                    : "Unknown")}
              </p>
              <p>
                <span className="font-medium text-gray-900">
                  {isRTL ? "تاريخ الرفع:" : "Uploaded At:"}
                </span>{" "}
                {formatDate(document.uploaded_at, locale)}
              </p>
              {document.processed_at && (
                <p>
                  <span className="font-medium text-gray-900">
                    {isRTL ? "تاريخ المعالجة:" : "Processed At:"}
                  </span>{" "}
                  {formatDate(document.processed_at, locale)}
                </p>
              )}
            </div>
          </div>

          {document.tags && document.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {isRTL ? "الوسوم" : "Tags"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tagValue) => (
                  <span
                    key={tagValue}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    <Tag className="h-3 w-3" />
                    {tagValue}
                  </span>
                ))}
              </div>
            </div>
          )}

          <AnalysisSection analysis={document.analysis} isRTL={isRTL} />
          <MetadataSection metadata={document.metadata} isRTL={isRTL} />
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isRTL ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDocumentsPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [uploadedByText, setUploadedByText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [expandedMetrics, setExpandedMetrics] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<KnowledgeDocumentSummary | null>(null);

  const uploadedBy = useMemo(() => {
    const parsed = parseInt(uploadedByText, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }, [uploadedByText]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter, uploadedBy, search]);

  const queryParams = useMemo(() => {
    const params: DocumentsQueryParams = {
      page,
      page_size: pageSize,
    };
    if (statusFilter) {
      params.status = statusFilter;
    }
    if (categoryFilter) {
      params.category = categoryFilter;
    }
    if (uploadedBy !== undefined) {
      params.uploaded_by = uploadedBy;
    }
    if (search) {
      params.search = search;
    }
    return params;
  }, [page, pageSize, statusFilter, categoryFilter, uploadedBy, search]);

  const documentsQuery = useDocuments(queryParams);
  const trainingMutation = useStartTraining();

  const data = documentsQuery.data;
  const documents: KnowledgeDocumentSummary[] = data?.documents ?? [];
  const pagination = data?.pagination;
  const metrics = data?.metrics;
  const totalPages = pagination?.total_pages ?? 1;

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((doc: KnowledgeDocumentSummary) => {
      if (doc.category) {
        set.add(doc.category);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [documents]);

  const canViewDocuments =
    user?.role === "super_admin" || user?.role === "admin";

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const resetFilters = () => {
    setStatusFilter("");
    setCategoryFilter("");
    setUploadedByText("");
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const statusCounts = metrics?.status_counts ?? {};
  const categoryCounts = metrics?.category_counts ?? {};

  if (!canViewDocuments) {
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
                ? "تحتاج إلى صلاحيات المسؤول للوصول إلى هذه الصفحة."
                : "You need admin permissions to access this page."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "مستندات المعرفة" : "Knowledge Documents"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "إدارة وتتبع المستندات المستخدمة في نظام المعرفة القانوني."
                : "Monitor and manage documents powering the legal knowledge system."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button
              onClick={() => documentsQuery.refetch()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={documentsQuery.isFetching}
            >
              {documentsQuery.isFetching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isRTL ? "تحديث" : "Refresh"}
            </button>
            <button
              onClick={() => trainingMutation.mutate()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              disabled={trainingMutation.isPending}
            >
              {trainingMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              {isRTL ? "بدء التدريب" : "Start Training"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">
                {isRTL ? "إجمالي المستندات" : "Total Documents"}
              </p>
              <p className="mt-2 text-2xl font-semibold text-blue-900">
                {metrics?.total_documents ?? 0}
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">
                {isRTL ? "المستندات المعالجة" : "Processed"}
              </p>
              <p className="mt-2 text-2xl font-semibold text-green-900">
                {statusCounts.processed ?? 0}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <p className="text-sm text-yellow-700 font-medium">
                {isRTL ? "قيد المعالجة" : "Processing"}
              </p>
              <p className="mt-2 text-2xl font-semibold text-yellow-900">
                {(statusCounts.processing ?? 0) + (statusCounts.raw ?? 0)}
              </p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">
                {isRTL ? "أخطاء" : "Errors"}
              </p>
              <p className="mt-2 text-2xl font-semibold text-red-900">
                {statusCounts.error ?? 0}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpandedMetrics((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {expandedMetrics ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {isRTL ? "عرض التفاصيل الإضافية" : "Toggle additional metrics"}
          </button>

          {expandedMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {isRTL ? "تفاصيل الحالة" : "Status Breakdown"}
                </h3>
                <div className="space-y-2">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                    >
                      <span>{getStatusLabel(status, isRTL)}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                  {Object.keys(statusCounts).length === 0 && (
                    <p className="text-sm text-gray-500">
                      {isRTL ? "لا توجد بيانات متاحة." : "No data available."}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {isRTL ? "الفئات" : "Categories"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200"
                    >
                      <FileText className="h-3 w-3" />
                      {category || (isRTL ? "غير مصنفة" : "Uncategorized")}
                      <span className="font-semibold text-gray-900">({count})</span>
                    </span>
                  ))}
                  {Object.keys(categoryCounts).length === 0 && (
                    <p className="text-sm text-gray-500">
                      {isRTL ? "لا توجد فئات متاحة." : "No category data available."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex flex-col lg:flex-row lg:items-center gap-4 ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={isRTL ? "البحث عن مستند..." : "Search documents..."}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                />
                <Search
                  className={`absolute inset-y-0 ${
                    isRTL ? "right-0 pr-3" : "left-0 pl-3"
                  } h-4 w-4 text-gray-400 my-auto`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <option value="">{isRTL ? "جميع الحالات" : "All statuses"}</option>
                  <option value="processed">{isRTL ? "معالج" : "Processed"}</option>
                  <option value="processing">{isRTL ? "قيد المعالجة" : "Processing"}</option>
                  <option value="raw">{isRTL ? "قيد الانتظار" : "Pending"}</option>
                  <option value="indexed">{isRTL ? "مفهرس" : "Indexed"}</option>
                  <option value="error">{isRTL ? "خطأ" : "Error"}</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <option value="">{isRTL ? "جميع الفئات" : "All categories"}</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category || (isRTL ? "غير مصنفة" : "Uncategorized")}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  value={uploadedByText}
                  onChange={(event) => setUploadedByText(event.target.value)}
                  placeholder={isRTL ? "معرف الرافع" : "Uploader ID"}
                  className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isRTL ? "بحث" : "Search"}
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  {isRTL ? "إعادة التعيين" : "Reset"}
                </button>
              </div>
            </form>
          </div>

          {documentsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : documentsQuery.isError ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {isRTL ? "فشل تحميل المستندات" : "Failed to load documents"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {isRTL
                  ? "حدث خطأ أثناء جلب البيانات. حاول مرة أخرى."
                  : "We could not fetch the documents. Please try again."}
              </p>
            </div>
          ) : documents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {isRTL ? "لا توجد مستندات" : "No documents found"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {isRTL
                  ? "جرّب تعديل معايير البحث أو التصفية."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {isRTL ? "المستند" : "Document"}
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {isRTL ? "الفئة" : "Category"}
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {isRTL ? "الحالة" : "Status"}
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {isRTL ? "الأجزاء" : "Chunks"}
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {isRTL ? "الرفع" : "Uploaded"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right"
                      >
                        {isRTL ? "إجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((document) => (
                      <tr key={document.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {document.title || document.original_filename}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {isRTL ? "المعرف" : "ID"}: {document.id}
                              </p>
                              {document.tags && document.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {document.tags.slice(0, 3).map((tagValue) => (
                                    <span
                                      key={tagValue}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium"
                                    >
                                      <Tag className="h-3 w-3" />
                                      {tagValue}
                                    </span>
                                  ))}
                                  {document.tags.length > 3 && (
                                    <span className="text-[10px] text-gray-500">
                                      +{document.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {document.category || (isRTL ? "غير مصنفة" : "Uncategorized")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill
                            status={document.status_normalized || document.status}
                            isRTL={isRTL}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {document.chunks_count ?? 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className={`flex items-center gap-2 ${isRTL ? "justify-end" : ""}`}>
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span>
                              {document.uploaded_by_user?.email ||
                                (document.uploaded_by
                                  ? `${isRTL ? "مستخدم #" : "User #"}${document.uploaded_by}`
                                  : isRTL
                                  ? "غير معروف"
                                  : "Unknown")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(document.uploaded_at, locale)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedDocument(document)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              {isRTL ? "عرض" : "View"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 gap-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
                <div>
                  {isRTL ? "عرض" : "Showing"}{" "}
                  <span className="font-medium">{documents.length}</span>{" "}
                  {isRTL ? "من أصل" : "of"}{" "}
                  <span className="font-medium">{pagination?.total ?? documents.length}</span>{" "}
                  {isRTL ? "مستند" : "documents"}
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRTL ? "السابق" : "Previous"}
                  </button>
                  <span className="text-sm text-gray-700">
                    {isRTL ? "الصفحة" : "Page"}{" "}
                    <span className="font-semibold">{page}</span>{" "}
                    {isRTL ? "من" : "of"}{" "}
                    <span className="font-semibold">{totalPages || 1}</span>
                  </span>
                  <button
                    onClick={() =>
                      setPage((prev) =>
                        totalPages ? Math.min(prev + 1, totalPages) : prev + 1
                      )
                    }
                    disabled={totalPages ? page >= totalPages : false}
                    className="px-3 py-1.5 border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRTL ? "التالي" : "Next"}
                  </button>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1.5 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size} {isRTL ? "لكل صفحة" : "per page"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <DocumentDetailsModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        locale={locale}
        isRTL={isRTL}
      />
    </DashboardLayout>
  );
}

