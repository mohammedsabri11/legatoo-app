"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { contractAnalysisApi } from "@/lib/api/contract-analysis";
import {
  FileText,
  Upload,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

interface ContractAnalysisResult {
  weak_points: string[];
  risks: string[];
  suggestions: string[];
}

export default function ContractAnalyseAIPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { feedbackState, showFeedback, closeFeedback } = useFeedbackModal();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleAnalyzeContract = async () => {
    if (!selectedFile) {
      showFeedback({
        variant: "error",
        title: isRTL ? "الملف مطلوب" : "File required",
        message: isRTL ? "يرجى اختيار ملف العقد" : "Please select a contract file before running analysis.",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await contractAnalysisApi.analyze(selectedFile);
      
      if (response.success && response.data) {
        setAnalysisResult(response.data);
      } else {
        setError(response.message || (isRTL ? "فشل تحليل العقد" : "Contract analysis failed"));
      }
    } catch (err: unknown) {
      console.error("Contract analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        isRTL
          ? `فشل تحليل العقد: ${errorMessage}`
          : `Contract analysis failed: ${errorMessage}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isRTL ? "تحليل العقود بالذكاء الاصطناعي" : "Contract Analyse AI"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isRTL
                  ? "حلل عقودك بسهولة واكتشف نقاط الضعف والمخاطر والتوصيات"
                  : "Analyze your contracts easily and discover weak points, risks, and suggestions"}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div
            className={`flex items-center justify-between mb-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isRTL ? "رفع مستند للتحليل" : "Upload Document for Analysis"}
            </h3>
            <label
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer ${
                isRTL ? "flex-row-reverse" : ""
              } ${isAnalyzing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Upload className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {isRTL ? "رفع مستند جديد" : "Upload New Document"}
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                disabled={isAnalyzing}
                className="hidden"
              />
            </label>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              {selectedFile ? (
                <>
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={handleAnalyzeContract}
                    disabled={isAnalyzing}
                    className={`mt-4 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                      isAnalyzing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`} />
                        {isRTL ? "جاري التحليل..." : "Analyzing..."}
                      </>
                    ) : (
                      isRTL ? "تحليل العقد" : "Analyze Contract"
                    )}
                  </button>
                  {!isAnalyzing && (
                    <button
                      onClick={handleClear}
                      className={`mt-2 ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                        isRTL ? "mr-2 ml-0" : ""
                      }`}
                    >
                      <X className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {isRTL ? "إلغاء" : "Clear"}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {isRTL
                      ? "انقر على الزر أعلاه لرفع ملف للتحليل"
                      : "Click the button above to upload a file for analysis"}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    {isRTL
                      ? "PDF, DOC, DOCX (حتى 20 ميجابايت)"
                      : "PDF, DOC, DOCX (up to 20MB)"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-white shadow rounded-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                {isRTL ? "جاري تحليل العقد..." : "Analyzing contract..."}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {isRTL ? "قد تستغرق هذه العملية بضع دقائق" : "This may take a few minutes"}
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-6">
            {/* Weak Points */}
            {analysisResult.weak_points && analysisResult.weak_points.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">
                    {isRTL ? "نقاط الضعف" : "Weak Points"}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {analysisResult.weak_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-red-800">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risks */}
            {analysisResult.risks && analysisResult.risks.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-900">
                    {isRTL ? "المخاطر" : "Risks"}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {analysisResult.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-orange-800">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="flex-1">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    {isRTL ? "التوصيات والاقتراحات" : "Suggestions"}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-blue-800">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="flex-1">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
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
        isRTL={isRTL}
      />
    </DashboardLayout>
  );
}

