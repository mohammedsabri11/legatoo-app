"use client";

import Link from "next/link";
import { Contract } from "@/lib/api/contracts";
import { StatusBadge } from "./StatusBadge";
import { FileText, Calendar, Globe, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { extractPlainText } from "@/utils/contractFormatting";
// Using native date formatting

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const { t } = useTranslation();
  
  return (
    <Link
      href={`/dashboard/contracts-library/${contract.id}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {contract.title}
          </h3>
        </div>
        <StatusBadge status={contract.status} />
      </div>

      <div className="space-y-2 mb-4">
        {contract.category && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{t("contracts.card.category")}:</span>
            <span>{contract.category}</span>
          </div>
        )}

        {contract.jurisdiction && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>{contract.jurisdiction}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(contract.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{t("contracts.card.version")} {contract.version}</span>
          {contract.ai_generated && (
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t("contracts.card.aiGenerated")}
            </span>
          )}
        </div>

        {contract.content && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {extractPlainText(contract.content)}
          </p>
        )}
      </div>
    </Link>
  );
}
