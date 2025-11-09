"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Grid, List } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { useContracts, useDeleteContract } from "@/hooks/contracts";
import { ContractTable, ContractCard, SearchBar } from "@/components/contracts";
import { ContractFilters } from "@/lib/api/contracts";
import { useTranslation } from "@/hooks/useTranslation";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

export default function ContractsLibraryPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ContractFilters>({
    page: 1,
    page_size: 20,
    search_query: "",
  });

  const { data, isLoading, error } = useContracts(filters);
  const deleteMutation = useDeleteContract();
  const { feedbackState, showFeedback, closeFeedback } = useFeedbackModal();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ ...filters, search_query: value, page: 1 });
  };

  const handleFilterChange = (key: keyof ContractFilters, value: string | number | boolean | undefined) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleDelete = (id: string) => {
    showFeedback({
      variant: "info",
      title: isRTL ? "تأكيد الحذف" : "Delete contract?",
      message: t("contracts.deleteConfirm") as string,
      confirmLabel: t("contracts.table.delete") as string,
      cancelLabel: isRTL ? "إلغاء" : "Cancel",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
        } catch (error) {
          // react-query mutation hook already surfaces a toast; swallow to avoid duplicate modals
          console.error("Contract delete failed:", error);
        }
      },
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("contracts.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("contracts.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/contracts-library/generate"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg "
          >
            <Plus className="w-5 h-5" />
            {t("contracts.newContract")}
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <select
            value={filters.status || ""}
            onChange={(e) =>
              handleFilterChange("status", e.target.value || undefined)
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="">{t("contracts.allStatus")}</option>
            <option value="draft">{t("contracts.status.draft")}</option>
            <option value="active">{t("contracts.status.active")}</option>
            <option value="archived">{t("contracts.status.archived")}</option>
          </select>

          <select
            value={filters.category || ""}
            onChange={(e) =>
              handleFilterChange("category", e.target.value || undefined)
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="">{t("contracts.allCategories")}</option>
            <option value="Employment">Employment</option>
            <option value="NDA">NDA</option>
            <option value="Partnership">Partnership</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${
                viewMode === "table"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>

          {data && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("contracts.showing")} {data.contracts.length} {t("contracts.of")} {data.total} {t("contracts.contracts")}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t("contracts.loading")}</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{t("contracts.errorLoading")}</p>
        </div>
      ) : data && data.contracts.length > 0 ? (
        <>
          {viewMode === "table" ? (
            <ContractTable
              contracts={data.contracts}
              onDelete={handleDelete}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.total > data.page_size && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                {t("contracts.previous")}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("contracts.page")} {filters.page} {t("contracts.of")} {Math.ceil(data.total / data.page_size!)}
              </span>
              <button
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page! >= Math.ceil(data.total / data.page_size!)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                {t("contracts.next")}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("contracts.noContractsFound")}
          </p>
          <Link
            href="/dashboard/contracts-library/generate"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg "
          >
            <Plus className="w-5 h-5" />
            {t("contracts.generateWithAI")}
          </Link>
        </div>
      )}
      </div>
      <FeedbackModal
        isOpen={feedbackState.isOpen}
        onClose={closeFeedback}
        title={feedbackState.title}
        message={feedbackState.message}
        variant={feedbackState.variant}
        onConfirm={feedbackState.onConfirm}
        confirmLabel={feedbackState.confirmLabel}
        cancelLabel={feedbackState.cancelLabel}
        isRTL={isRTL}
      />
    </DashboardLayout>
  );
}
