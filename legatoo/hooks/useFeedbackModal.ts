"use client";

import { useCallback, useState } from "react";
import { FeedbackVariant } from "@/components/ui/feedback-modal";

export interface FeedbackState {
  isOpen: boolean;
  message: string;
  title?: string;
  variant: FeedbackVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => Promise<void> | void;
}

export interface ShowFeedbackOptions {
  message: string;
  title?: string;
  variant?: FeedbackVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => Promise<void> | void;
}

export function useFeedbackModal() {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    isOpen: false,
    message: "",
    variant: "info",
  });

  const closeFeedback = useCallback(() => {
    setFeedbackState((prev) => ({
      ...prev,
      isOpen: false,
      confirmLabel: undefined,
      cancelLabel: undefined,
      onConfirm: undefined,
    }));
  }, []);

  const showFeedback = useCallback((options: ShowFeedbackOptions) => {
    setFeedbackState({
      isOpen: true,
      message: options.message,
      title: options.title,
      variant: options.variant ?? "info",
      confirmLabel: options.confirmLabel,
      cancelLabel: options.cancelLabel,
      onConfirm: options.onConfirm,
    });
  }, []);

  return { feedbackState, showFeedback, closeFeedback };
}

