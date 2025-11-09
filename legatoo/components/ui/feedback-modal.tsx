"use client";

import React from "react";
import { Button } from "./button";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export type FeedbackVariant = "success" | "error" | "info";

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  variant?: FeedbackVariant;
  isRTL?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => Promise<void> | void;
}

const variantConfig: Record<
  FeedbackVariant,
  { icon: React.ReactNode; accent: string; textColor: string }
> = {
  success: {
    icon: <CheckCircle className="h-10 w-10 text-green-500" />,
    accent: "bg-green-500/10",
    textColor: "text-green-600",
  },
  error: {
    icon: <AlertCircle className="h-10 w-10 text-red-500" />,
    accent: "bg-red-500/10",
    textColor: "text-red-600",
  },
  info: {
    icon: <Info className="h-10 w-10 text-blue-500" />,
    accent: "bg-blue-500/10",
    textColor: "text-blue-600",
  },
};

export function FeedbackModal({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
  isRTL = false,
  confirmLabel,
  cancelLabel,
  onConfirm,
}: FeedbackModalProps) {
  if (!isOpen) return null;

  const config = variantConfig[variant];

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${config.accent}`}
        >
          {config.icon}
        </div>

        <div className={`mt-4 ${config.textColor} font-semibold text-lg`}>
          {title ||
            (variant === "success"
              ? isRTL
                ? "تم بنجاح"
                : "Success"
              : variant === "error"
              ? isRTL
                ? "حدث خطأ"
                : "Something went wrong"
              : isRTL
              ? "معلومة"
              : "Notice")}
        </div>

        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{message}</p>

        <div
          className={`mt-6 flex items-center justify-end gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={isRTL ? "ml-0 mr-2" : ""}
          >
            {cancelLabel || (isRTL ? "إغلاق" : "Close")}
          </Button>
          {onConfirm && (
          <Button onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
              {confirmLabel || (isRTL ? "تأكيد" : "Confirm")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

