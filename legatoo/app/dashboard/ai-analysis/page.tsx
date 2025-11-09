"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { Modal } from "@/components/ui";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import { caseAnalysisApi, AnalysisHistoryItem, AnalysisSections } from "@/lib/api/case-analysis";
import {
  Brain,
  Upload,
  FileText,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Plus, 
  FolderOpen,
  Loader2,
  X,
} from "lucide-react";

// Type definitions for analysis results
interface AnalysisData {
  risk_score?: number;
  risk_label?: string;
  full_analysis?: string;
  formatted_analysis?: string;
  sections?: AnalysisSections;
  key_findings?: string[];
  detailed_recommendations?: string[];
  executive_summary?: string;
  legal_analysis?: string;
  legal_status?: string;
  weak_points?: string;
  strong_points?: string;
  legal_basis?: string;
  risk_analysis?: string;
  obligations_rights?: string;
  recommendations?: string;
  settlement_recommendations?: string;
  legal_action_recommendations?: string;
  protection_recommendations?: string;
  client_information?: string;
  simple_explanation?: string;
  next_steps?: string;
  legal_strategy?: string;
  legal_research?: string;
  professional_risks?: string;
  quantitative_assessment?: string;
  legal_references?: string;
  [key: string]: unknown;
}

interface AnalysisResult {
  id: number | string;
  fileName: string;
  uploadedAt: string;
  status: "pending" | "uploading" | "completed" | "error" | "processing" | "failed";
  riskScore: number;
  riskLabel: string;
  analysisData: AnalysisData;
  lawsuitType: string;
  resultSeeking: string;
}

export default function AIAnalysisPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState<"recent" | "history">("recent");
  const { feedbackState, showFeedback, closeFeedback } = useFeedbackModal();


  // Analysis results state - now managed by useState above

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 25) return "text-green-600";
    if (score <= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskLabel = (score: number) => {
    if (score <= 25) return isRTL ? "منخفض" : "Low";
    if (score <= 50) return isRTL ? "متوسط" : "Medium";
    return isRTL ? "عالي" : "High";
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  interface UploadedFile {
    id: string;
    file: File;
    status: "pending" | "uploading" | "completed" | "error";
    progress?: number;
  }

  interface LegalAnalysisData {
    analysisType: "case-analysis" | "contract-review" | "";
    lawsuitType: string;
    resultSeeking: string;
    files: UploadedFile[];
  }

  const handleModalSubmit = async (data: LegalAnalysisData) => {
    if (!data.analysisType || !data.lawsuitType || !data.resultSeeking || data.files.length === 0) {
      showFeedback({
        variant: "error",
        title: isRTL ? "بيانات ناقصة" : "Missing information",
        message: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
      });
      return;
    }

    setIsLoading(true);
    setIsModalOpen(false);

    try {
      const response = await caseAnalysisApi.analyze({
        files: data.files.map((f) => f.file),
        analysis_type: data.analysisType as "case-analysis" | "contract-review",
        lawsuit_type: data.lawsuitType,
        result_seeking: data.resultSeeking,
      });

      if (response.success && response.data) {
        // Extract analysis data - handle both direct structure and nested structure
        const analysisData = response.data.analysis || {};
        
        const newAnalysis = {
          id: response.data.analysis_id || Date.now(),
          fileName: response.data.filename,
          uploadedAt: response.data.uploaded_at,
          status: response.data.status || "completed",
          riskScore: analysisData.risk_score || 50,
          riskLabel: analysisData.risk_label || "Medium",
          analysisData: analysisData,
          lawsuitType: response.data.lawsuit_type,
          resultSeeking: response.data.result_seeking,
        };

        console.log("New analysis created:", newAnalysis); // Debug log
        setAnalysisResults((prev) => [newAnalysis, ...prev]);
        setSelectedFile(data.files[0].file);
        
        // If on history tab, reload history; otherwise keep the new analysis in recent
        if (historyTab === "history") {
          loadAnalysisHistory();
        }
        
        showFeedback({
          variant: "success",
          title: isRTL ? "تم التحليل" : "Analysis complete",
          message: isRTL ? "تم تحليل المستند بنجاح" : "Analysis completed successfully",
        });
      } else {
        throw new Error(response.message || "Analysis failed");
      }
    } catch (error: unknown) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showFeedback({
        variant: "error",
        title: isRTL ? "فشل التحليل" : "Analysis failed",
        message:
          isRTL
            ? `فشل التحليل: ${errorMessage}`
            : `Analysis failed: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (result: AnalysisResult) => {
    setSelectedAnalysis(result);
    setIsDetailModalOpen(true);
  };

  // Load analysis history from backend
  const loadAnalysisHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await caseAnalysisApi.getHistory(0, 100);
      if (response.success && response.data) {
        // Convert history items to display format
        // Note: analysis_data contains the full data structure, with analysis nested inside
        const formattedResults: AnalysisResult[] = response.data.analyses.map((item: AnalysisHistoryItem) => {
          // Extract analysis from analysis_data if it exists, otherwise use analysis_data directly
          const rawAnalysisData = item.analysis_data?.analysis || item.analysis_data || {};
          const analysisData: AnalysisData = rawAnalysisData as AnalysisData;
          
          return {
            id: item.id,
            fileName: item.filename,
            uploadedAt: item.created_at,
            status: "completed" as const,
            riskScore: item.risk_score || analysisData.risk_score || 50,
            riskLabel: item.risk_label || analysisData.risk_label || "Medium",
            analysisData: analysisData,
            lawsuitType: item.lawsuit_type,
            resultSeeking: item.result_seeking || "",
          };
        });
        
        console.log("Loaded analysis history:", formattedResults); // Debug log
        setAnalysisResults(formattedResults);
      }
    } catch (error: unknown) {
      console.error("Failed to load analysis history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load history on component mount
  useEffect(() => {
    if (historyTab === "history") {
      loadAnalysisHistory();
    }
  }, [historyTab]);

  // Download PDF handler
  const handleDownloadPDF = async (analysisId: number | string, filename: string) => {
    try {
      const id = typeof analysisId === "string" ? parseInt(analysisId, 10) : analysisId;
      if (isNaN(id)) {
        throw new Error("Invalid analysis ID");
      }
      const blob = await caseAnalysisApi.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename.replace(/\.[^/.]+$/, "")}_analysis_${analysisId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: unknown) {
      console.error("Download failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showFeedback({
        variant: "error",
        title: isRTL ? "فشل التنزيل" : "Download failed",
        message:
          isRTL
            ? `فشل التنزيل: ${errorMessage}`
            : `Download failed: ${errorMessage}`,
      });
    }
  };

  // Delete analysis handler
  const handleDeleteAnalysis = (analysisId: number | string) => {
    const id = typeof analysisId === "string" ? parseInt(analysisId, 10) : analysisId;
    if (isNaN(id)) {
      showFeedback({
        variant: "error",
        title: isRTL ? "معرّف غير صالح" : "Invalid analysis",
        message: isRTL
          ? "تعذر حذف التحليل لأن المعرّف غير صالح."
          : "Unable to delete this analysis because the identifier is invalid.",
      });
      return;
    }

    showFeedback({
      variant: "info",
      title: isRTL ? "تأكيد الحذف" : "Delete analysis?",
      message: isRTL
        ? "هل أنت متأكد من حذف هذا التحليل؟ لا يمكن التراجع عن هذا الإجراء."
        : "Are you sure you want to delete this analysis? This action cannot be undone.",
      confirmLabel: isRTL ? "حذف" : "Delete",
      cancelLabel: isRTL ? "إلغاء" : "Cancel",
      onConfirm: async () => {
        try {
          await caseAnalysisApi.deleteAnalysis(id);
          setAnalysisResults((prev) => prev.filter((r) => r.id !== analysisId));
          if (historyTab === "history") {
            await loadAnalysisHistory();
          }
          setTimeout(() => {
            showFeedback({
              variant: "success",
              title: isRTL ? "تم الحذف" : "Deleted",
              message: isRTL
                ? "تم حذف التحليل بنجاح."
                : "Analysis deleted successfully.",
            });
          }, 0);
        } catch (error: unknown) {
          console.error("Delete failed:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          setTimeout(() => {
            showFeedback({
              variant: "error",
              title: isRTL ? "فشل الحذف" : "Delete failed",
              message:
                isRTL
                  ? `فشل الحذف: ${errorMessage}`
                  : `Delete failed: ${errorMessage}`,
            });
          }, 0);
        }
      },
    });
  };

  // Case Analysis Tab Content
  const CaseAnalysisContent = () => (
    <div className="space-y-6">
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
          <button
            onClick={handleOpenModal}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90  ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {isRTL ? "رفع مستند جديد" : "Upload New Document"}
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              {isRTL
                ? "انقر على الزر أعلاه لرفع ملف للتحليل"
                : "Click the button above to upload a file for analysis"}
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              {isRTL
                ? "PDF, DOC, DOCX (حتى 10 ميجابايت)"
                : "PDF, DOC, DOCX (up to 10MB)"}
            </span> 
          </div>
        </div>
      </div>

      {/* AI Assistant Banner */}
      {selectedFile && (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-indigo-700/90"></div>
          <div className="relative px-8 py-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <Brain className="h-8 w-8 text-white animate-pulse mr-3" />
                <h3 className="text-2xl font-bold !text-white">
                  {isRTL ? "مساعد الذكاء الاصطناعي" : "AI Assistant"}
                </h3>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg w-[40%] mx-auto px-6 py-4 mb-4">
                <p className="text-white font-semibold text-lg">
                  {selectedFile.name}
                </p>
                <p className="text-purple-100 text-sm mt-1">
                  {isRTL
                    ? "مستندك جاهز للتحليل المتقدم"
                    : "Your document is ready for advanced analysis"}
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div
                className={`flex-1 ${
                  isRTL ? "text-right" : "text-left"
                } mb-4 lg:mb-0`}
              >
                <p className="text-purple-100 text-sm lg:text-base max-w-2xl">
                  {isRTL
                    ? "احصل على مساعدة فورية من مساعد الذكاء الاصطناعي المتقدم لتحليل أعمق وتوصيات مخصصة لمستندك القانوني"
                    : "Get instant assistance from our advanced AI assistant for deeper analysis and personalized recommendations for your legal document"}
                </p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center text-purple-200">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {isRTL ? "تحليل متقدم" : "Advanced Analysis"}
                    </span>
                  </div>
                  <div className="flex items-center text-purple-200">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {isRTL ? "توصيات مخصصة" : "Custom Recommendations"}
                    </span>
                  </div>
                  <div className="flex items-center text-purple-200">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {isRTL ? "دعم فوري" : "Instant Support"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button className="group relative inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-purple-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 transform hover:scale-105 shadow-lg animate-pulse">
                  <Brain className="h-6 w-6 mr-3 text-purple-600 group-hover:animate-pulse" />
                  <span>
                    {isRTL
                      ? `احصل على المساعدة لحالتك`
                      : `Get Assistance for your case`}
                  </span>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
      )}

      {/* Tabs for Recent vs History */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className={`flex ${isRTL ? "": "flex-row-reverse" } -mb-px`}>
            <button
              onClick={() => setHistoryTab("recent")}
              className={`${
                historyTab === "recent"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } ${isRTL ? "ml-4" : "mr-4"} py-4 px-6 text-sm font-medium border-b-2 focus:outline-none`}
            >
              {isRTL ? "الحديثة" : "Recent"}
            </button>
            <button
              onClick={() => setHistoryTab("history")}
              className={`${
                historyTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } py-4 px-6 text-sm font-medium border-b-2 focus:outline-none`}
            >
              {isRTL ? "التاريخ الكامل" : "Full History"}
            </button>
          </nav>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {historyTab === "recent"
                ? isRTL
                  ? "نتائج التحليل الحديثة"
                  : "Recent Analysis Results"
                : isRTL
                ? "جميع التحليلات"
                : "All Analyses"}
          </h3>
            {historyTab === "history" && (
              <button
                onClick={loadAnalysisHistory}
                disabled={isLoadingHistory}
                className={`text-sm text-primary hover:text-primary/80 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {isLoadingHistory ? (
                  <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`} />
                ) : (
                  <FolderOpen className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                )}
                {isRTL ? "تحديث" : "Refresh"}
              </button>
            )}
          </div>
          {!isLoadingHistory && analysisResults.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-500">
                {isRTL ? "لا توجد نتائج تحليل بعد" : "No analysis results yet"}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                {isRTL ? "قم برفع مستند للبدء" : "Upload a document to get started"}
              </p>
            </div>
          ) : isLoadingHistory ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
              <p className="mt-4 text-sm text-gray-500">
                {isRTL ? "جاري تحميل التاريخ..." : "Loading history..."}
              </p>
            </div>
          ) : (
          <div className="space-y-4">
            {analysisResults.map((result) => (
              <div
                key={result.id}
                className="shadow-md border-gray-200 rounded-lg p-4"
              >
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div
                      className={`ml-4 ${
                        isRTL ? "mr-4 ml-0 text-right" : "text-left"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {result.fileName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(result.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        result.status
                      )}`}
                    >
                      {result.status === "completed"
                        ? isRTL
                          ? "مكتمل"
                          : "Completed"
                        : result.status === "processing"
                        ? isRTL
                          ? "قيد المعالجة"
                          : "Processing"
                        : result.status === "failed"
                        ? isRTL
                          ? "فشل"
                          : "Failed"
                        : result.status}
                    </span>
                    <button 
                      onClick={() => handleViewDetails(result)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title={isRTL ? "عرض التفاصيل" : "View Details"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(result.id, result.fileName)}
                      className="text-gray-400 hover:text-blue-600 p-1"
                      title={isRTL ? "تنزيل PDF" : "Download PDF"}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {historyTab === "history" && (
                      <button 
                        onClick={() => handleDeleteAnalysis(result.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title={isRTL ? "حذف التحليل" : "Delete Analysis"}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {result.status === "completed" && (
                  <div className="mt-4 space-y-4">
                    {/* Risk Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {isRTL ? "درجة المخاطر:" : "Risk Score:"}
                      </span>
                      <div className="flex items-center">
                        <span
                          className={`text-lg font-bold ${getRiskColor(
                            result.riskScore
                          )}`}
                        >
                          {result.riskScore}%
                        </span>
                        <span
                          className={`ml-2 text-sm ${getRiskColor(
                            result.riskScore
                          )}`}
                        >
                          ({getRiskLabel(result.riskScore)})
                        </span>
                      </div>
                    </div>

                    {/* Key Findings */}
                    {(result.analysisData?.key_findings && result.analysisData.key_findings.length > 0) || 
                     (result.analysisData?.sections?.key_findings && result.analysisData.sections.key_findings.length > 0) ? (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? "النتائج الرئيسية:" : "Key Findings:"}
                        </h4>
                        <ul className="space-y-1">
                          {(result.analysisData?.key_findings || result.analysisData?.sections?.key_findings || []).slice(0, 3).map((finding: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle
                                className={`h-4 w-4 text-yellow-500 mt-0.5 ${
                                  isRTL ? "ml-2" : "mr-2"
                                }`}
                              />
                              <span className="text-sm text-gray-600">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {/* Detailed Recommendations */}
                    {((result.analysisData?.detailed_recommendations && result.analysisData.detailed_recommendations.length > 0) ||
                      (result.analysisData?.sections?.detailed_recommendations && result.analysisData.sections.detailed_recommendations.length > 0)) ? (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? "التوصيات:" : "Recommendations:"}
                        </h4>
                        <ul className="space-y-1">
                          {(result.analysisData?.detailed_recommendations || result.analysisData?.sections?.detailed_recommendations || []).slice(0, 3).map(
                            (recommendation: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle
                                  className={`h-4 w-4 text-green-500 mt-0.5 ${
                                    isRTL ? "ml-2" : "mr-2"
                                  }`}
                                />
                                <span className="text-sm text-gray-600">
                                  {recommendation}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : null}

                    {/* View Full Analysis Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleViewDetails(result)}
                        className={`w-full text-sm text-primary hover:text-primary/80 font-medium ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {isRTL ? "عرض التحليل الكامل →" : "→ View Full Analysis"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );


  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
            isRTL ? "": "sm:flex-row-reverse" 
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "تحليل وإدارة القضايا" : "Case Analysis & Management"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "تحليل وإدارة المستندات القانونية باستخدام الذكاء الاصطناعي"
                : "Analyze and manage legal documents using artificial intelligence"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "إجمالي التحليلات" : "Total Analyses"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">156</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "تحليلات مكتملة" : "Completed"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">142</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "قيد المعالجة" : "Processing"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">8</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "متوسط دقة التحليل" : "Avg. Accuracy"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">94.2%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Case Analysis Content */}
        <CaseAnalysisContent />

        {/* Upload Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isRTL ? "تحليل القضية" : "Case Analysis"}
          onSubmit={handleModalSubmit}
          isRTL={isRTL}
          type="analysis"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-gray-700">
                {isRTL ? "جاري تحليل المستند..." : "Analyzing document..."}
              </p>
            </div>
          </div>
        )}

        {/* Detailed Analysis Modal */}
        {isDetailModalOpen && selectedAnalysis && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col ${isRTL ? "text-right" : "text-left"}`}>
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${isRTL ? "flex-row-reverse" : ""}`}>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isRTL ? "التفاصيل الكاملة للتحليل" : "Full Analysis Details"}
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-6">
                <div className="space-y-6">
                  {/* File Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isRTL ? "معلومات الملف" : "File Information"}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedAnalysis.fileName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(selectedAnalysis.uploadedAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Risk Score */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {isRTL ? "درجة المخاطر:" : "Risk Score:"}
                      </span>
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getRiskColor(selectedAnalysis.riskScore)}`}>
                          {selectedAnalysis.riskScore}%
                        </span>
                        <span className={`ml-2 text-sm ${getRiskColor(selectedAnalysis.riskScore)}`}>
                          ({selectedAnalysis.riskLabel})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Full Analysis Text */}
                  {(selectedAnalysis.analysisData?.formatted_analysis as string | undefined) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {isRTL ? "التحليل الكامل" : "Complete Analysis"}
                      </h3>
                      <div className="prose max-w-none bg-gray-50 rounded-lg p-6">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {String(selectedAnalysis.analysisData?.formatted_analysis || "")}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Sections - Display all sections with clear headlines */}
                  {selectedAnalysis.analysisData?.sections && (
                    <div className="space-y-8">
                      {/* 1. Executive Summary */}
                      {(selectedAnalysis.analysisData.sections.executive_summary as string | undefined) && (
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {isRTL ? "1. الملخص التنفيذي" : "1. Executive Summary"}
                          </h3>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {String(selectedAnalysis.analysisData.sections.executive_summary || "")}
                          </div>
                        </div>
                      )}

                      {/* 2. Legal Analysis */}
                      {(selectedAnalysis.analysisData.sections.legal_analysis as string | undefined) && (
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {isRTL ? "2. التحليل القانوني المفصل" : "2. Detailed Legal Analysis"}
                          </h3>
                          <div className="space-y-4">
                            {/* Legal Status */}
                            {(selectedAnalysis.analysisData.sections.legal_status as string | undefined) && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "أ. الوضع القانوني الحالي" : "a. Current Legal Status"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.legal_status || "")}
                                </div>
                              </div>
                            )}

                            {/* Weak Points */}
                            {(selectedAnalysis.analysisData.sections.weak_points as string | undefined) && (
                              <div className="bg-red-50 rounded-lg p-4">
                                <h4 className="font-semibold text-red-900 mb-2">
                                  {isRTL ? "ب. نقاط الضعف في القضية" : "b. Weak Points in the Case"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.weak_points || "")}
                                </div>
                              </div>
                            )}

                            {/* Strong Points */}
                            {(selectedAnalysis.analysisData.sections.strong_points as string | undefined) && (
                              <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="font-semibold text-green-900 mb-2">
                                  {isRTL ? "ج. نقاط القوة في القضية" : "c. Strong Points in the Case"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.strong_points || "")}
                                </div>
                              </div>
                            )}

                            {/* Legal Basis */}
                            {(selectedAnalysis.analysisData.sections.legal_basis as string | undefined) && (
                              <div className="bg-yellow-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "د. الأساس القانوني السعودي" : "d. Saudi Legal Basis"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.legal_basis || "")}
                                </div>
                              </div>
                            )}

                            {/* Risk Analysis */}
                            {(selectedAnalysis.analysisData.sections.risk_analysis as string | undefined) && (
                              <div className="bg-orange-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "هـ. تحليل المخاطر القانونية" : "e. Legal Risk Analysis"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.risk_analysis || "")}
                                </div>
                              </div>
                            )}

                            {/* Obligations and Rights */}
                            {(selectedAnalysis.analysisData.sections.obligations_rights as string | undefined) && (
                              <div className="bg-indigo-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "و. الواجبات والحقوق" : "f. Obligations and Rights"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.obligations_rights || "")}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 3. Recommendations */}
                      {((selectedAnalysis.analysisData.sections.recommendations as string | undefined) ||
                        (selectedAnalysis.analysisData.sections.settlement_recommendations as string | undefined) ||
                        (selectedAnalysis.analysisData.sections.legal_action_recommendations as string | undefined) ||
                        (selectedAnalysis.analysisData.sections.protection_recommendations as string | undefined)) && (
                        <div className="border-l-4 border-green-500 pl-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {isRTL ? "3. التوصيات العملية" : "3. Practical Recommendations"}
                          </h3>
                          <div className="space-y-3">
                            {(selectedAnalysis.analysisData.sections.settlement_recommendations as string | undefined) && (
                              <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "أ. توصيات التسوية" : "a. Settlement Recommendations"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.settlement_recommendations || "")}
                                </div>
                              </div>
                            )}
                            {(selectedAnalysis.analysisData.sections.legal_action_recommendations as string | undefined) && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "ب. توصيات الإجراءات القانونية" : "b. Legal Action Recommendations"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.legal_action_recommendations || "")}
                                </div>
                              </div>
                            )}
                            {(selectedAnalysis.analysisData.sections.protection_recommendations as string | undefined) && (
                              <div className="bg-purple-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "ج. توصيات حماية المصالح" : "c. Protection Recommendations"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.protection_recommendations || "")}
                                </div>
                              </div>
                            )}
                          </div>
                          {(selectedAnalysis.analysisData.sections.recommendations as string | undefined) && (
                            <div className="text-sm text-gray-700 whitespace-pre-wrap mt-3">
                              {String(selectedAnalysis.analysisData.sections.recommendations || "")}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. Client Information */}
                      {((selectedAnalysis.analysisData.sections.client_information as string | undefined) || 
                        (selectedAnalysis.analysisData.sections.simple_explanation as string | undefined) ||
                        (selectedAnalysis.analysisData.sections.next_steps as string | undefined)) && (
                        <div className="border-l-4 border-indigo-500 pl-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {isRTL ? "4. المعلومات للعميل/المستخدم" : "4. Information for Client/User"}
                          </h3>
                          <div className="space-y-3">
                            {(selectedAnalysis.analysisData.sections.simple_explanation as string | undefined) && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "أ. شرح مبسط" : "a. Simple Explanation"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.simple_explanation || "")}
                                </div>
                              </div>
                            )}
                            {(selectedAnalysis.analysisData.sections.next_steps as string | undefined) && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "ب. الخطوات التالية" : "b. Next Steps"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.next_steps || "")}
                                </div>
                              </div>
                            )}
                            {(selectedAnalysis.analysisData.sections.client_information as string | undefined) && (
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {String(selectedAnalysis.analysisData.sections.client_information || "")}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 5. Advanced Analysis for Lawyers */}
                      {((selectedAnalysis.analysisData.sections.legal_strategy as string | undefined) ||
                        (selectedAnalysis.analysisData.sections.legal_research as string | undefined) ||
                        (selectedAnalysis.analysisData.sections.professional_risks as string | undefined)) && (
                        <div className="border-l-4 border-purple-600 pl-4 bg-purple-50 rounded-lg p-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {isRTL ? "5. التحليل المتقدم للمحامين" : "5. Advanced Analysis for Lawyers"}
                          </h3>
                          <div className="space-y-3">
                            {(selectedAnalysis.analysisData.sections.legal_strategy as string | undefined) && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "أ. الاستراتيجية القانونية" : "a. Legal Strategy"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.legal_strategy || "")}
                                </div>
                              </div>
                            )}
                            {(selectedAnalysis.analysisData.sections.legal_research as string | undefined) && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "ب. البحث القانوني المطلوب" : "b. Required Legal Research"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.legal_research || "")}
                                </div>
                              </div>
                            )}
                            {(selectedAnalysis.analysisData.sections.professional_risks as string | undefined) && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {isRTL ? "ج. المخاطر المهنية" : "c. Professional Risks"}
                                </h4>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {String(selectedAnalysis.analysisData.sections.professional_risks || "")}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 6. Quantitative Assessment */}
                      {(selectedAnalysis.analysisData.sections.quantitative_assessment as string | undefined) && (
                        <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 rounded-lg p-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {isRTL ? "6. التقييم الكمي" : "6. Quantitative Assessment"}
                          </h3>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {String(selectedAnalysis.analysisData.sections.quantitative_assessment || "")}
                          </div>
                        </div>
                      )}

                      {/* 7. Legal References */}
                      {(selectedAnalysis.analysisData.sections.legal_references as string | undefined) && (
                        <div className="border-l-4 border-gray-500 pl-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {isRTL ? "7. المراجع القانونية" : "7. Legal References"}
                          </h3>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                            {String(selectedAnalysis.analysisData.sections.legal_references || "")}
                          </div>
                        </div>
                      )}

                      {/* Full Analysis Text (if sections parsing didn't work well) */}
                      {(!selectedAnalysis.analysisData.sections.executive_summary && 
                        (selectedAnalysis.analysisData.formatted_analysis as string | undefined)) && (
                        <div className="border-t pt-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {isRTL ? "التحليل الكامل" : "Complete Analysis"}
                          </h3>
                          <div className="prose max-w-none bg-gray-50 rounded-lg p-6">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                              {String(selectedAnalysis.analysisData.formatted_analysis || "")}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-end p-6 border-t ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  {isRTL ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <FeedbackModal
        isOpen={feedbackState.isOpen}
        onClose={closeFeedback}
        title={feedbackState.title}
        message={feedbackState.message}
        variant={feedbackState.variant}
        isRTL={isRTL}
        onConfirm={feedbackState.onConfirm}
        confirmLabel={feedbackState.confirmLabel}
        cancelLabel={feedbackState.cancelLabel}
      />
    </DashboardLayout>
  );
}
