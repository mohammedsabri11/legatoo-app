"use client";

import React, { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { Loader2, AlertCircle, CheckCircle, Clock, Database } from "lucide-react";
import toast from "react-hot-toast";

interface StatusBadgeProps {
  status: "raw" | "processing" | "processed" | "indexed";
  lawId: number;
  documentId: number;
  language: "ar" | "en";
  onStatusChange?: (newStatus: "raw" | "processing" | "processed" | "indexed") => void;
}

export function StatusBadge({
  status,
  lawId,
  documentId,
  language,
  onStatusChange,
}: StatusBadgeProps) {
  const [currentStatus, setCurrentStatus] = useState<
    "raw" | "processing" | "processed" | "indexed"
  >(status);
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = language === "ar";

  const statusConfig = {
    raw: {
      ar: { label: "غير معالج", hint: "انقر للمعالجة" },
      en: { label: "Unprocessed", hint: "Click to process" },
    },
    processing: {
      ar: { label: "جاري المعالجة", hint: "يتم المعالجة في الخلفية" },
      en: { label: "Processing", hint: "Processing in background" },
    },
    processed: {
      ar: { label: "معالج", hint: "جاهز للاستخدام" },
      en: { label: "Processed", hint: "Ready to use" },
    },
    indexed: {
      ar: { label: "مفهرس", hint: "تمت الفهرسة بنجاح" },
      en: { label: "Indexed", hint: "Successfully indexed" },
    },
  };

  const config = statusConfig[currentStatus][language];

  const handleClick = async () => {
    if (currentStatus !== "raw" || isLoading) return;

    try {
      // Step 1: Immediately update UI (optimistic update)
      setCurrentStatus("processing");
      setIsLoading(true);
      if (onStatusChange) onStatusChange("processing");

      // Show success toast immediately
      toast.success(
        isRTL
          ? "بدأت معالجة المستند في الخلفية"
          : "Document processing started in background"
      );

      // Step 2: Call API
      const response = await authApi.generateEmbeddings(documentId);

      if (response.success) {
        // Status already updated in UI
        console.log("✅ Embedding generation started:", response.message);
      } else {
        // Revert on error
        setCurrentStatus("raw");
        setIsLoading(false);
        if (onStatusChange) onStatusChange("raw");
        toast.error(
          response.message ||
            (isRTL ? "فشل بدء المعالجة" : "Failed to start processing")
        );
      }
    } catch (error) {
      // Revert on error
      setCurrentStatus("raw");
      setIsLoading(false);
      if (onStatusChange) onStatusChange("raw");
      console.error("Error generating embeddings:", error);
      toast.error(
        isRTL
          ? "حدث خطأ أثناء بدء المعالجة"
          : "Error starting embedding generation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyles = () => {
    switch (currentStatus) {
      case "raw":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "processed":
        return "bg-green-100 text-green-800 border-green-300";
      case "indexed":
        return "bg-purple-100 text-purple-800 border-purple-300";
    }
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case "raw":
        return <AlertCircle className="h-3 w-3" />;
      case "processing":
        return isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Clock className="h-3 w-3" />
        );
      case "processed":
        return <CheckCircle className="h-3 w-3" />;
      case "indexed":
        return <Database className="h-3 w-3" />;
    }
  };

  const isClickable = currentStatus === "raw" && !isLoading;

  return (
    <button
      onClick={handleClick}
      disabled={!isClickable}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${getStatusStyles()} ${
        isClickable
          ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
          : "cursor-default"
      } disabled:opacity-60`}
      title={config.hint}
      type="button"
    >
      {getStatusIcon()}
      <span className={isRTL ? "mr-1" : "ml-1"}>{config.label}</span>
      {isLoading && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
    </button> //hjj
  );
}

