"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Brain, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRTL?: boolean;
}

type TrainingStatus = "starting" | "in_progress" | "completed" | "error";

export function TrainingModal({
  isOpen,
  onClose,
  isRTL = false,
}: TrainingModalProps) {
  const [status, setStatus] = useState<TrainingStatus>("starting");
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDurationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const statusRef = useRef<TrainingStatus>("starting");

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setStatus("starting");
      statusRef.current = "starting";
      setProgress(0);
      setTimeRemaining(0);
      setResult(null);
      setElapsedTime(0);
    }
  }, [isOpen]);

  // Start training simulation when modal opens
  useEffect(() => {
    if (isOpen && status === "starting") {
      // Random duration between 5-10 minutes (300-600 seconds)
      const minDuration = 300; // 5 minutes
      const maxDuration = 600; // 10 minutes
      totalDurationRef.current = Math.floor(
        Math.random() * (maxDuration - minDuration + 1) + minDuration
      );
      
      startTimeRef.current = Date.now();
      setTimeRemaining(totalDurationRef.current);
      setStatus("in_progress");
      statusRef.current = "in_progress";

      // Update progress every second
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
        const remaining = Math.max(0, totalDurationRef.current - elapsed);
        setTimeRemaining(remaining);
        
        // Calculate progress percentage
        const progressPercent = Math.min(
          99,
          Math.floor((elapsed / totalDurationRef.current) * 100)
        );
        setProgress(progressPercent);

        // When time is up, complete training
        if (remaining <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setProgress(100);
          setStatus("completed");
          statusRef.current = "completed";
          
          // Generate random result between 50-70%
          const minResult = 50;
          const maxResult = 70;
          const randomResult = Math.floor(
            Math.random() * (maxResult - minResult + 1) + minResult
          );
          setResult(randomResult);
        }
      }, 1000);

      // Fallback timeout (shouldn't be needed, but safety measure)
      timerRef.current = setTimeout(() => {
        // Check if still in progress using ref (avoids closure issue)
        if (statusRef.current === "in_progress" || intervalRef.current !== null) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setProgress(100);
          setStatus("completed");
          statusRef.current = "completed";
          
          const minResult = 50;
          const maxResult = 70;
          const randomResult = Math.floor(
            Math.random() * (maxResult - minResult + 1) + minResult
          );
          setResult(randomResult);
        }
      }, (totalDurationRef.current + 5) * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, status]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    if (status === "in_progress") {
      // Ask for confirmation if training is in progress
      if (
        window.confirm(
          isRTL
            ? "هل أنت متأكد من إغلاق النافذة؟ سيتم إيقاف عملية التدريب."
            : "Are you sure you want to close? Training will be stopped."
        )
      ) {
        // Stop the training
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-lg shadow-xl max-w-lg w-full ${isRTL ? "text-right" : "text-left"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b border-gray-200 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`flex items-center space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div
              className={`p-2 rounded-lg ${
                status === "completed"
                  ? "bg-green-100"
                  : status === "in_progress"
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              {status === "completed" ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : status === "in_progress" ? (
                <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
              ) : (
                <Brain className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {status === "completed"
                ? isRTL
                  ? "اكتمل التدريب"
                  : "Training Completed"
                : status === "in_progress"
                ? isRTL
                  ? "جاري التدريب..."
                  : "Training in Progress..."
                : isRTL
                ? "بدء التدريب"
                : "Start Training"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={status === "in_progress"}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "in_progress" && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {isRTL ? "التقدم" : "Progress"}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Time Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {isRTL ? "الوقت المتبقي" : "Time Remaining"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(timeRemaining)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {isRTL ? "الوقت المنقضي" : "Elapsed Time"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(elapsedTime)}
                  </p>
                </div>
              </div>

              {/* Status Messages */}
              <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-4">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700">
                  {isRTL
                    ? "جاري معالجة البيانات وتدريب النموذج..."
                    : "Processing data and training the model..."}
                </p>
              </div>
            </div>
          )}

          {status === "completed" && result !== null && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center space-x-3 bg-green-50 rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-700">
                  {isRTL
                    ? "تم إكمال التدريب بنجاح!"
                    : "Training completed successfully!"}
                </p>
              </div>

              {/* Result Display */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  {isRTL ? "نتيجة التدريب" : "Training Result"}
                </p>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(result / 100) * 351.86} 351.86`}
                      className="text-green-600 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {result}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isRTL ? "دقة" : "Accuracy"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? "تفاصيل النتيجة:" : "Result Details:"}
                </p>
                <p className="text-xs text-gray-600">
                  {isRTL
                    ? `تم تحقيق دقة بنسبة ${result}% في تدريب النموذج.`
                    : `Achieved ${result}% accuracy in model training.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end p-6 border-t border-gray-200 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={handleClose}
            className={`px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              status === "in_progress" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={status === "in_progress"}
          >
            {status === "completed"
              ? isRTL
                ? "إغلاق"
                : "Close"
              : isRTL
              ? "إلغاء"
              : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

