"use client";

import Link from "next/link";
import { Contract } from "@/lib/api/contracts";
import { StatusBadge } from "./StatusBadge";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
// Using native date formatting
import { useState } from "react";

interface ContractTableProps {
  contracts: Contract[];
  onDelete?: (id: string) => void;
}

export function ContractTable({ contracts, onDelete }: ContractTableProps) {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("contracts.table.title")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("contracts.table.category")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("contracts.table.status")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("contracts.table.created")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("contracts.table.updated")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("contracts.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                {t("contracts.table.noContractsFound")}
              </td>
            </tr>
          ) : (
            contracts.map((contract) => (
              <tr
                key={contract.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/dashboard/contracts-library/${contract.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {contract.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {contract.category || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={contract.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(contract.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {contract.updated_at
                    ? new Date(contract.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === contract.id ? null : contract.id
                        )
                      }
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {activeMenu === contract.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        <Link
                          href={`/dashboard/contracts-library/${contract.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setActiveMenu(null)}
                        >
                          <Eye className="w-4 h-4" />
                          {t("contracts.table.view")}
                        </Link>
                        <Link
                          href={`/dashboard/contracts-library/edit/${contract.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setActiveMenu(null)}
                        >
                          <Edit className="w-4 h-4" />
                          {t("contracts.table.edit")}
                        </Link>
                        {onDelete && (
                          <button
                            onClick={() => {
                              onDelete(contract.id);
                              setActiveMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t("contracts.table.delete")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
