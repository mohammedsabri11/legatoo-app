"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  Download,
  ChevronDown,
  FolderOpen,
  File,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ComponentType<{ className?: string }>;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  titleAr: string;
  subtitles: Subtitle[];
}

interface Subtitle {
  id: string;
  title: string;
  titleAr: string;
  documents: Document[];
}

interface Document {
  id: string;
  title: string;
  type: string;
  language: "en" | "ar";
  status: "pending" | "processing" | "done" | "error";
  chunks: number;
  uploadedAt: string;
}

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    document: {
      id: number;
      title: string;
      document_type: string;
      language: "en" | "ar";
      uploaded_by_id: number;
      created_at: string;
      processing_status: "pending" | "processing" | "done" | "error";
      is_processed: boolean;
      notes: string;
      file_path: string;
      file_url?: string;
      chunks_count: number | null;
      analysis?: {
        type: string;
        confidence: number;
        keyPoints: string[];
        summary?: string;
        extractedClauses?: string[];
      };
    };
    chunks: Array<{
      id: number;
      chunk_index: number;
      content: string;
      article_number: string | null;
      section_title: string | null;
      keywords: string[];
      page_number: number | null;
      source_reference: string | null;
      has_embedding: boolean;
      created_at: string;
    }>;
    statistics: {
      total_chunks: number;
      chunks_with_embeddings: number;
      chunks_with_article_numbers: number;
      chunks_with_section_titles: number;
      keywords_extracted: number;
    };
  } | null;
  categories?: Category[];
  lawTreeData?: {
    id: number;
    name: string;
    type: string;
    jurisdiction: string;
    issuing_authority: string;
    issue_date: string | null;
    last_update: string | null;
    description: string;
    source_url: string;
    status: "raw" | "processed";
    articles: Array<{
      id: number;
      article_number: string;
      title: string;
      content: string;
      keywords: string[];
      order_index: number;
      ai_processed_at: string | null;
      created_at: string;
    }>;
  } | null;
  isRTL?: boolean;
}

export function DocumentViewModal({
  isOpen,
  onClose,
  document,
  categories = [],
  lawTreeData,
  isRTL,
}: DocumentViewModalProps) {
  // State for managing expanded categories and selected subtitle
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  const [expandedSubtitles, setExpandedSubtitles] = useState<Set<string>>(
    new Set()
  );
  const [selectedSubtitle, setSelectedSubtitle] = useState<Subtitle | null>(
    null
  );

  // State for law articles
  const [selectedArticle, setSelectedArticle] = useState<{
    id: number;
    article_number: string;
    title: string;
    content: string;
    keywords: string[];
    order_index: number;
    ai_processed_at: string | null;
    created_at: string;
  } | null>(null);

  if (!isOpen || !document) {
    return null;
  }

  // Check if we're viewing a category (not a specific document)
  const isViewingCategory = document.document.document_type === "category";
  const currentCategory = isViewingCategory
    ? categories.find(
        (cat) => (isRTL ? cat.nameAr : cat.name) === document.document.title
      )
    : null;

  // Extract document data for easier access
  const docData = document.document;

  // Toggle functions for categories
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const toggleSubtitle = (subtitleId: string) => {
    setExpandedSubtitles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subtitleId)) {
        newSet.delete(subtitleId);
      } else {
        newSet.add(subtitleId);
      }
      return newSet;
    });
  };

  const handleSubtitleClick = (subtitle: Subtitle) => {
    setSelectedSubtitle(subtitle);
  };

  // Toggle functions for law articles (simplified - no branches/chapters)

  const handleArticleClick = (article: {
    id: number;
    article_number: string;
    title: string;
    content: string;
    keywords: string[];
    order_index: number;
    ai_processed_at: string | null;
    created_at: string;
  }) => {
    setSelectedArticle(article);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLanguageFlag = (language: string) => {
    return language === "en" ? "🇬🇧" : "🇸🇦";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4  overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? "تفاصيل المستند" : "Document Details"}
              </h2>
              <p className="text-sm text-gray-500">{docData.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Two Panel Layout */}
        <div className="flex flex-col md:flex-row h-[calc(90vh-140px)]">
          {/* Left Panel - Categories */}
          <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg !text-right font-medium text-gray-900 mb-4">
                {lawTreeData
                  ? isRTL
                    ? "هيكل القانون"
                    : "Law Structure"
                  : isRTL
                  ? "قائمة المصادر القانونية"
                  : "Legal Source Categories"}
              </h3>

              <div className="space-y-2">
                {lawTreeData
                  ? // Show law articles (simplified flat structure)
                    <div className="bg-white rounded-lg shadow-sm">
                      {/* Articles List */}
                      <div className="max-h-[600px] overflow-y-auto">
                        {lawTreeData.articles.map((article) => {
                          const isSelected = selectedArticle?.id === article.id;

                          return (
                            <div
                              key={article.id}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              {/* Article Header */}
                              <div
                                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border-l-4 border-primary"
                                    : ""
                                }`}
                                onClick={() => handleArticleClick(article)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <File className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h6 className="text-sm font-medium text-gray-900 !text-right">
                                      {article.article_number}{" "}
                                      {article.title && (
                                        <span className="text-gray-600">
                                          - {article.title}
                                        </span>
                                      )}
                                    </h6>
                                    <p className="text-xs text-gray-500 mt-1 !text-right">
                                      {article.keywords.length}{" "}
                                      {isRTL ? "كلمة مفتاحية" : "keywords"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  : // Show original categories structure
                    (isViewingCategory && currentCategory
                      ? [currentCategory]
                      : categories
                    ).map((category) => {
                      const CategoryIcon = category.icon;
                      const isExpanded = expandedCategories.has(category.id);

                      return (
                        <div
                          key={category.id}
                          className="bg-white rounded-lg shadow-sm"
                        >
                          {/* Category Header */}
                          <div
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-t-lg"
                            onClick={() => toggleCategory(category.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-1 bg-primary/10 rounded">
                                  <CategoryIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {isRTL ? category.nameAr : category.name}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {category.chapters.length}{" "}
                                    {isRTL ? "فصل" : "chapters"}
                                  </p>
                                </div>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {/* Expanded Chapters */}
                          {isExpanded && (
                            <div className="border-t border-gray-100">
                              {category.chapters.map((chapter) => {
                                const isChapterExpanded = expandedChapters.has(
                                  chapter.id
                                );

                                return (
                                  <div
                                    key={chapter.id}
                                    className="border-b border-gray-100 last:border-b-0"
                                  >
                                    {/* Chapter Header */}
                                    <div
                                      className="px-6 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                      onClick={() => toggleChapter(chapter.id)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <FolderOpen className="h-3 w-3 text-gray-600" />
                                          <div>
                                            <h5 className="text-xs font-medium text-gray-800">
                                              {isRTL
                                                ? chapter.titleAr
                                                : chapter.title}
                                            </h5>
                                            <p className="text-xs text-gray-500">
                                              {chapter.subtitles.length}{" "}
                                              {isRTL
                                                ? "عنوان فرعي"
                                                : "subtitles"}
                                            </p>
                                          </div>
                                        </div>
                                        <ChevronDown
                                          className={`h-3 w-3 text-gray-400 transition-transform ${
                                            isChapterExpanded
                                              ? "rotate-180"
                                              : ""
                                          }`}
                                        />
                                      </div>
                                    </div>

                                    {/* Expanded Subtitles */}
                                    {isChapterExpanded && (
                                      <div className="bg-gray-50">
                                        {chapter.subtitles.map((subtitle) => {
                                          const isSubtitleExpanded =
                                            expandedSubtitles.has(subtitle.id);
                                          const isSelected =
                                            selectedSubtitle?.id ===
                                            subtitle.id;

                                          return (
                                            <div
                                              key={subtitle.id}
                                              className="border-b border-gray-100 last:border-b-0"
                                            >
                                              {/* Subtitle Header */}
                                              <div
                                                className={`px-8 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                                                  isSelected
                                                    ? "bg-primary/10 border-l-2 border-primary"
                                                    : ""
                                                }`}
                                                onClick={() => {
                                                  toggleSubtitle(subtitle.id);
                                                  handleSubtitleClick(subtitle);
                                                }}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center space-x-2">
                                                    <File className="h-3 w-3 text-gray-500" />
                                                    <div>
                                                      <h6 className="text-xs font-medium text-gray-700">
                                                        {isRTL
                                                          ? subtitle.titleAr
                                                          : subtitle.title}
                                                      </h6>
                                                      <p className="text-xs text-gray-500">
                                                        {
                                                          subtitle.documents
                                                            .length
                                                        }{" "}
                                                        {isRTL
                                                          ? "مستند"
                                                          : "documents"}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <ChevronDown
                                                    className={`h-3 w-3 text-gray-400 transition-transform ${
                                                      isSubtitleExpanded
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                                  />
                                                </div>
                                              </div>

                                              {/* Expanded Documents */}
                                              {isSubtitleExpanded && (
                                                <div className="bg-white px-10 py-1">
                                                  {subtitle.documents.map(
                                                    (document) => (
                                                      <div
                                                        key={document.id}
                                                        className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded mb-1 last:mb-0"
                                                      >
                                                        <div className="flex items-center space-x-2">
                                                          <div className="p-1 bg-gray-100 rounded">
                                                            <FileText className="h-2 w-2 text-gray-600" />
                                                          </div>
                                                          <div>
                                                            <p className="text-xs font-medium text-gray-900">
                                                              {document.title}
                                                            </p>
                                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                              <span>
                                                                {document.type}
                                                              </span>
                                                              <span>•</span>
                                                              <span>
                                                                {document.language ===
                                                                "en"
                                                                  ? "🇬🇧"
                                                                  : "🇸🇦"}
                                                              </span>
                                                              <span>•</span>
                                                              <span>
                                                                {
                                                                  document.chunks
                                                                }{" "}
                                                                chunks
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <span
                                                          className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${
                                                            document.status ===
                                                            "done"
                                                              ? "bg-green-100 text-green-800"
                                                              : document.status ===
                                                                "processing"
                                                              ? "bg-yellow-100 text-yellow-800"
                                                              : "bg-gray-100 text-gray-800"
                                                          }`}
                                                        >
                                                          {document.status}
                                                        </span>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
          

          {/* Right Panel - Document Details */}
          <div className="w-full md:w-2/3 overflow-y-auto ">
            {lawTreeData && selectedArticle ? (
              <div className="p-6">
                <h3 className="text-lg !text-right font-medium text-gray-900 mb-4">
                  {selectedArticle.article_number} {selectedArticle.title}
                </h3>

                {/* Article Content */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="prose max-w-none">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap !text-right">
                      {selectedArticle.content}
                    </p>
                  </div>
                </div>

                {/* Article Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm !text-right text-gray-600 mb-6">
                  <div>
                    <span className="font-medium">
                      {isRTL ? "رقم المادة:" : "Article Number:"}
                    </span>{" "}
                    {selectedArticle.article_number}
                  </div>
                  <div>
                    <span className="font-medium">
                      {isRTL ? "الكلمات المفتاحية:" : "Keywords:"}
                    </span>{" "}
                    {selectedArticle.keywords.length}
                  </div>
                  <div>
                    <span className="font-medium">
                      {isRTL ? "تاريخ الإنشاء:" : "Created:"}
                    </span>{" "}
                    {formatDate(selectedArticle.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">
                      {isRTL ? "معالجة الذكاء الاصطناعي:" : "AI Processed:"}
                    </span>{" "}
                    {selectedArticle.ai_processed_at
                      ? formatDate(selectedArticle.ai_processed_at)
                      : isRTL
                      ? "لم يتم"
                      : "Not processed"}
                  </div>
                </div>

                {/* Keywords */}
                {selectedArticle.keywords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3 !text-right">
                      {isRTL ? "الكلمات المفتاحية" : "Keywords"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : lawTreeData ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {isRTL
                      ? "اختر مادة لعرض التفاصيل"
                      : "Select an article to view details"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isRTL
                      ? "انقر على أي مادة في القائمة الجانبية لعرض المحتوى"
                      : "Click on any article in the sidebar to view content"}
                  </p>
                </div>
              </div>
            ) : isViewingCategory && currentCategory ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isRTL ? currentCategory.nameAr : currentCategory.name}
                </h3>

                {/* Category Overview */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">
                        {isRTL ? "عدد الفصول:" : "Chapters:"}
                      </span>{" "}
                      {currentCategory.chapters.length}
                    </div>
                    <div>
                      <span className="font-medium">
                        {isRTL ? "إجمالي المستندات:" : "Total Documents:"}
                      </span>{" "}
                      {currentCategory.chapters.reduce(
                        (total, chapter) =>
                          total +
                          chapter.subtitles.reduce(
                            (subTotal, subtitle) =>
                              subTotal + subtitle.documents.length,
                            0
                          ),
                        0
                      )}
                    </div>
                  </div>
                </div>

                {/* Chapters List */}
                <div className="space-y-4">
                  {currentCategory.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="bg-white p-4 rounded-lg border"
                    >
                      <h4 className="text-md font-medium text-gray-900 mb-3">
                        {isRTL ? chapter.titleAr : chapter.title}
                      </h4>

                      {/* Subtitles */}
                      <div className="space-y-2">
                        {chapter.subtitles.map((subtitle) => (
                          <div
                            key={subtitle.id}
                            className="bg-gray-50 p-3 rounded border"
                          >
                            <h5 className="text-sm font-medium text-gray-800 mb-2">
                              {isRTL ? subtitle.titleAr : subtitle.title}
                            </h5>

                            {/* Documents */}
                            <div className="space-y-1">
                              {subtitle.documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between py-1 px-2 bg-white rounded"
                                >
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-3 w-3 text-gray-600" />
                                    <span className="text-xs font-medium text-gray-900">
                                      {doc.title}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({doc.type})
                                    </span>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${
                                      doc.status === "done"
                                        ? "bg-green-100 text-green-800"
                                        : doc.status === "processing"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {doc.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedSubtitle ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isRTL ? selectedSubtitle.titleAr : selectedSubtitle.title}
                </h3>

                {/* Documents in this subtitle */}
                <div className="space-y-4">
                  {selectedSubtitle.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-medium text-gray-900">
                          {doc.title}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === "done"
                              ? "bg-green-100 text-green-800"
                              : doc.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">
                            {isRTL ? "النوع:" : "Type:"}
                          </span>{" "}
                          {doc.type}
                        </div>
                        <div>
                          <span className="font-medium">
                            {isRTL ? "اللغة:" : "Language:"}
                          </span>{" "}
                          {getLanguageFlag(doc.language)}{" "}
                          {doc.language === "en" ? "English" : "Arabic"}
                        </div>
                        <div>
                          <span className="font-medium">
                            {isRTL ? "الأجزاء:" : "Chunks:"}
                          </span>{" "}
                          {doc.chunks}
                        </div>
                        <div>
                          <span className="font-medium">
                            {isRTL ? "تاريخ الرفع:" : "Upload Date:"}
                          </span>{" "}
                          {formatDate(doc.uploadedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {isRTL
                      ? "اختر عنوان فرعي لعرض التفاصيل"
                      : "Select a subtitle to view details"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isRTL
                      ? "انقر على أي عنوان فرعي في القائمة الجانبية لعرض المستندات"
                      : "Click on any subtitle in the sidebar to view documents"}
                  </p>
                </div>
              </div>
            )}
          </div>
         
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {selectedArticle && (
              <span>
                {isRTL ? "المادة المحددة:" : "Selected Article:"}{" "}
                {selectedArticle.article_number} {selectedArticle.title}
              </span>
            )}
            {selectedSubtitle && !selectedArticle && (
              <span>
                {isRTL ? "العنوان المحدد:" : "Selected:"}{" "}
                {isRTL ? selectedSubtitle.titleAr : selectedSubtitle.title}
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() =>
                console.log("Download functionality to be implemented")
              }
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              {isRTL ? "تحميل" : "Download"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isRTL ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
