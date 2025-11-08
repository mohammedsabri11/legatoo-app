"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { templatesApi, TemplateListItem } from "@/lib/api/templates";
import toast from "react-hot-toast";
import { 
  Library, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit3,
  FileText,
  Calendar,
  Tag,
  Star,
  Copy,
  Loader2,
  X
} from "lucide-react";
import { authUtils } from "@/lib/auth-utils";

interface Template extends TemplateListItem {
  lastModified?: string;
  downloads?: number;
  rating?: number;
  tags?: string[];
  isFavorite?: boolean;
  fileSize?: string;
}

export default function TemplatesPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewingTemplateId, setPreviewingTemplateId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewType, setPreviewType] = useState<'pdf' | 'html' | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const handlePreview = async (templateId: string) => {
    try {
      setPreviewLoading(true);
      setPreviewingTemplateId(templateId);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
        (typeof window !== 'undefined' && window.location.hostname.includes('fastestfranchise.net')
          ? "https://api.fastestfranchise.net/api/v1"
          : "http://localhost:8000/api/v1");
      
      await authUtils.ensureValidToken();
      const token = authUtils.getAccessToken();
      
      const response = await fetch(`${baseUrl}/templates/${templateId}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate preview');
      }

      // Get the PDF/HTML as blob and create object URL
      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || '';
      
      console.log('Preview blob size:', blob.size, 'Content-Type:', contentType);
      
      // Determine preview type
      if (contentType.includes('html') || contentType.includes('text/html')) {
        setPreviewType('html');
      } else if (contentType.includes('pdf') || contentType.includes('application/pdf')) {
        setPreviewType('pdf');
      } else {
        // Default to PDF if unknown
        setPreviewType('pdf');
      }
      
      const url = URL.createObjectURL(blob);
      console.log('Preview URL created:', url);
      setPreviewUrl(url);
      
      toast.success(t('templates.preview.success' as never) || 'Preview generated successfully');
    } catch (error: unknown) {
      console.error("Error generating preview:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate preview';
      toast.error(errorMessage || (t('templates.preview.error' as never) as string) || 'Failed to generate preview');
      setPreviewingTemplateId(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewingTemplateId(null);
    setPreviewType(null);
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templatesApi.getTemplates();
      // Transform API data to match component expectations
      const transformedTemplates: Template[] = data.map((template) => ({
        ...template,
        lastModified: template.created_at ? new Date(template.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        downloads: 0, // Not tracked yet
        rating: 4.5, // Default
        tags: template.category ? [template.category.toLowerCase()] : [],
      isFavorite: false,
        fileSize: template.format === 'docx' ? '2.3 MB' : '1.8 MB',
        format: template.format.toUpperCase()
      }));
      setTemplates(transformedTemplates);
    } catch (error: unknown) {
      console.error("Error loading templates:", error);
      const errorMessage = error instanceof Error ? error.message : t('templates.errors.loadFailed');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: t('templates.categories.all'), count: templates.length },
    { id: 'Employment', name: t('templates.categories.employment'), count: templates.filter(t => t.category === 'Employment').length },
    { id: 'Confidentiality', name: t('templates.categories.confidentiality'), count: templates.filter(t => t.category === 'Confidentiality').length },
    { id: 'Service', name: t('templates.categories.service'), count: templates.filter(t => t.category === 'Service').length },
    { id: 'Commercial', name: t('templates.categories.commercial'), count: templates.filter(t => t.category === 'Commercial').length }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Employment':
        return 'bg-blue-100 text-blue-800';
      case 'Confidentiality':
        return 'bg-purple-100 text-purple-800';
      case 'Service':
        return 'bg-green-100 text-green-800';
      case 'Commercial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('templates.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t('templates.subtitle')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('templates.addNewTemplate')}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Library className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('templates.stats.totalTemplates')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">156</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('templates.stats.totalDownloads')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">2,847</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('templates.stats.averageRating')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">4.6</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Tag className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('templates.stats.availableCategories')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('templates.categories.title')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('templates.search.placeholder')}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'}  border !border-primary rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center px-3 py-2 border !border-primary shadow-sm text-sm leading-4 font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('templates.search.filter')}
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {template.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getCategoryColor(template.category || '')}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <button className={`ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>
                    <Star className={`h-5 w-5 ${template.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4" />
                    <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>
                      {template.lastModified ? new Date(template.lastModified).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4" />
                    <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>
                      {template.downloads}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className={`text-sm text-gray-600 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                      {template.rating}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {template.fileSize} • {template.format}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {template.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                  {template.tags && template.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handlePreview(template.id)}
                    disabled={previewLoading}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {previewLoading && previewingTemplateId === template.id ? (
                      <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    ) : (
                    <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    )}
                    {t('templates.template.preview')}
                  </button>
                  <Link
                    href={`/dashboard/templates/${template.id}/use`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Copy className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('templates.template.use')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Templates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {t('templates.popular.title')}
          </h3>
          <div className="space-y-3">
            {templates
              .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
              .slice(0, 5)
              .map((template, index) => (
                <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {template.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {template.downloads} {t('templates.template.downloads')} • {template.rating} ⭐
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category || '')}`}>
                    {template.category}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Preview Modal */}
        {previewUrl && previewingTemplateId && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closePreview}
              ></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
                      {t('templates.preview.title' as never) || 'Template Preview'}
                    </h3>
                    <button
                      onClick={closePreview}
                      className="inline-flex items-center px-2 py-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    {previewLoading ? (
                      <div className="flex items-center justify-center h-[600px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className={`ml-3 text-gray-600 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                          {t('templates.preview.loading') || 'Loading preview...'}
                        </span>
                      </div>
                    ) : previewType === 'html' ? (
                      <iframe
                        src={previewUrl || undefined}
                        className="w-full h-[600px] border-0"
                        title="Template Preview"
                        sandbox="allow-same-origin allow-scripts"
                        onError={(e) => {
                          console.error('Iframe error:', e);
                        }}
                      />
                    ) : previewType === 'pdf' ? (
                      <div className="w-full h-[600px] relative">
                        <embed
                          src={previewUrl || undefined}
                          type="application/pdf"
                          className="w-full h-full"
                          title="Template Preview"
                        />
                        <div className="absolute bottom-4 right-4">
                          <a
                            href={previewUrl || '#'}
                            download={`template_preview_${previewingTemplateId}.pdf`}
                            className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('templates.preview.download') || 'Download'}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[600px] p-8">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-center">
                          {t('templates.preview.error') || 'Failed to load preview'}
                        </p>
                        {previewUrl && (
                          <a
                            href={previewUrl}
                            download
                            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('templates.preview.download') || 'Download File'}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={closePreview}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {t('templates.preview.close' as never) || 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

