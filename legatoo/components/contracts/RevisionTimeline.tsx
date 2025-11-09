"use client";

import { Revision } from "@/lib/api/contracts";
import { GitBranch, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { extractPlainText } from "@/utils/contractFormatting";
// Using native date formatting

interface RevisionTimelineProps {
  revisions: Revision[];
}

export function RevisionTimeline({ revisions }: RevisionTimelineProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {revisions.map((revision, revisionIdx) => (
          <li key={revision.id}>
            <div className="relative pb-8">
              {revisionIdx !== revisions.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                    <GitBranch className="h-4 w-4 text-white" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t("contracts.card.version")} {revision.revision_number}
                      </p>
                      {revision.changes_summary && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          - {revision.changes_summary}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(revision.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {revision.updated_content && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded max-h-32 overflow-y-auto">
                        <p className="line-clamp-3">
                          {extractPlainText(revision.updated_content)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
