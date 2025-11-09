"use client";

import { use, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard";
import { useContract } from "@/hooks/contracts";
import { StatusBadge } from "@/components/contracts";
import { contractsApi } from "@/lib/api/contracts";
import { Edit, History, FileText, Globe, Calendar, Sparkles, ArrowLeft, Download, FileDown } from "lucide-react";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

export default function ContractDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: contract, isLoading, error } = useContract(id);
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);
  const { feedbackState, showFeedback, closeFeedback } = useFeedbackModal();

  const handleExport = async (format: "pdf" | "docx") => {
    if (!contract) return;
    
    setExporting(format);
    try {
      const blob = await contractsApi.exportContract(contract.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract_${contract.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      showFeedback({
        variant: "error",
        title: "Export failed",
        message: "Failed to export contract. Please try again.",
      });
    } finally {
      setExporting(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contract...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contract) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Contract not found or error loading contract.</p>
          <Link href="/dashboard/contracts-library" className="mt-4 text-blue-600 hover:underline">
            Back to Contracts
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/contracts-library"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {contract.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Contract Details and Content
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/contracts-library/edit/${contract.id}`}
            className="flex items-center gap-2 px-4 py-2  text-white rounded-lg bg-primary hover:bg-primary/90"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <Link
            href={`/dashboard/contracts-library/history/${contract.id}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <div className="relative group">
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting === "pdf" ? "Exporting..." : "Export PDF"}
            </button>
          </div>
          <button
            onClick={() => handleExport("docx")}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {exporting === "docx" ? "Exporting..." : "Export Word"}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <FileText className="w-4 h-4" />
            Status
          </div>
          <StatusBadge status={contract.status} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            Version
          </div>
          <p className="text-lg font-semibold">Version {contract.version}</p>
        </div>

        {contract.ai_generated && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Sparkles className="w-4 h-4" />
              Generated by AI
            </div>
            <p className="text-sm">AI Generated</p>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Contract Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {contract.category && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
              <p className="font-medium">{contract.category}</p>
            </div>
          )}
          {contract.jurisdiction && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Jurisdiction:
              </span>
              <p className="font-medium">{contract.jurisdiction}</p>
            </div>
          )}
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Language:</span>
            <p className="font-medium">{contract.language.toUpperCase()}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
            <p className="font-medium">
              {new Date(contract.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Contract Content</h2>
        <div className="prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded">
            {contract.content || "No content available"}
          </pre>
        </div>
      </div>
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
      />
    </DashboardLayout>
  );
}
