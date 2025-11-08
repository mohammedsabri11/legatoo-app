"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { useTemplates, useDeleteTemplate } from "@/hooks/contracts";
import { TemplateCard, SearchBar } from "@/components/contracts";
import { TemplateFilters } from "@/lib/api/contracts";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TemplateFilters>({
    page: 1,
    page_size: 20,
    search_query: "",
  });

  const { data, isLoading, error } = useTemplates(filters);
  const deleteMutation = useDeleteTemplate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ ...filters, search_query: value, page: 1 });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contract Templates
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse and manage contract templates
          </p>
        </div>
        <Link
          href="/dashboard/contracts-library/templates/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90  text-white rounded-lg "
        >
          <Plus className="w-5 h-5" />
          New Template
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search templates..."
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading templates.</p>
        </div>
      ) : data && data.templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No templates found.</p>
          <Link
            href="/dashboard/contracts-library/templates/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg "
          >
            <Plus className="w-5 h-5" />
            Create Template
          </Link>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
