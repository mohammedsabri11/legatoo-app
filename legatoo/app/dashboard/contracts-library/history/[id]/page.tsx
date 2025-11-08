"use client";

import { use } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard";
import { useContractHistory } from "@/hooks/contracts";
import { RevisionTimeline } from "@/components/contracts";
import { ArrowLeft } from "lucide-react";

export default function ContractHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useContractHistory(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading history...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading revision history.</p>
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
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/contracts-library/${id}`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Revision History
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View all versions and changes made to this contract
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Contract: {data.contract_id}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Revisions: {data.total_revisions}
          </p>
        </div>

        {data.revisions && data.revisions.length > 0 ? (
          <RevisionTimeline revisions={data.revisions} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No revision history available yet.
            </p>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}
