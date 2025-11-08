"use client";

import Link from "next/link";
import { ContractTemplate } from "@/lib/api/contracts";
import { Library, Globe, Lock, Unlock, Tag } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
// Using native date formatting

interface TemplateCardProps {
  template: ContractTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const { t } = useTranslation();
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Library className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {template.name}
          </h3>
        </div>
        {template.is_public ? (
          <Unlock className="w-4 h-4 text-green-600" />
        ) : (
          <Lock className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {template.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {template.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        {template.jurisdiction && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Globe className="w-4 h-4" />
            <span>{template.jurisdiction}</span>
          </div>
        )}

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{template.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500">
          {t("contracts.templates.created")} {new Date(template.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <Link
          href={`/dashboard/contracts-library/templates/${template.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {t("contracts.templates.viewTemplate")} →
        </Link>
      </div>
    </div>
  );
}
