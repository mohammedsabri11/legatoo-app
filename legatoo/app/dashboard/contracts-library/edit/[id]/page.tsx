"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard";
import { useContract, useUpdateContract } from "@/hooks/contracts";
import { ContractEditor } from "@/components/contracts";
import { contractsApi } from "@/lib/api/contracts";
import { ArrowLeft, Save, Download, FileDown } from "lucide-react";

export default function EditContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: contract, isLoading } = useContract(id);
  const updateMutation = useUpdateContract();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "active" | "archived">("draft");
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);

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
      alert("Failed to export contract. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  useEffect(() => {
    if (contract) {
      setTitle(contract.title);
      setContent(contract.content || "");
      setStatus(contract.status);
    }
  }, [contract]);

  const handleSave = async () => {
    if (!contract) return;

    try {
      // Use the latest content from state (which is updated by onSave callback)
      await updateMutation.mutateAsync({
        id: contract.id,
        data: {
          title,
          content, // This will be the latest content from onSave callback
          status,
        },
      });
    } catch (error) {
      console.error("Save error:", error);
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

  if (!contract) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Contract not found.</p>
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
          href={`/dashboard/contracts-library/${contract.id}`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
            placeholder="Contract Title"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "active" | "archived")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting === "pdf" ? "Exporting..." : "PDF"}
          </button>
          <button
            onClick={() => handleExport("docx")}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {exporting === "docx" ? "Exporting..." : "Word"}
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <ContractEditor
          content={content}
          onSave={(savedContent) => {
            // Update content state with saved content
            setContent(savedContent);
            // Then call the save handler which uses the current state
            handleSave();
          }}
        />
      </div>
      </div>
    </DashboardLayout>
  );
}
