"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, RefreshCw, Save } from "lucide-react";
import { useGenerateContract, useSaveAIContract } from "@/hooks/contracts";
import { AIGenerateRequest } from "@/lib/api/contracts";
import { useTranslation } from "@/hooks/useTranslation";
import { ContractEditor } from "./ContractEditor";
import { normalizeContractContent } from "@/utils/contractFormatting";

interface AIContractGeneratorProps {
  onSave?: (requestId: string) => void;
}

export function AIContractGenerator({ onSave }: AIContractGeneratorProps) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const latestContentRef = useRef<string | null>(null);

  const generateMutation = useGenerateContract();
  const saveMutation = useSaveAIContract();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const request: AIGenerateRequest = {
      prompt_text: prompt,
      category: category || undefined,
      jurisdiction: jurisdiction || undefined,
    };

    try {
      const result = await generateMutation.mutateAsync(request);
      const normalized = normalizeContractContent(result.generated_content);
      setGeneratedContent(normalized);
      setRequestId(result.request_id);
      latestContentRef.current = normalized;
    } catch (error) {
      console.error("Generation error:", error);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleSave = async () => {
    if (!requestId) return;

    // Use latest content from ref (which is updated by editor) or fallback to state
    const contentToSave = latestContentRef.current || generatedContent;
    if (!contentToSave) return;

    const title = prompt.substring(0, 100) || "AI Generated Contract";
    
    try {
      await saveMutation.mutateAsync({
        requestId,
        data: {
          title,
          content: contentToSave,
          category: category || undefined,
          jurisdiction: jurisdiction || undefined,
          status: "draft",
        },
      });
      if (onSave) onSave(requestId);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("contracts.generate.describeContract")}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t("contracts.generate.describePlaceholder")}
            className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("contracts.generate.category")}
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("contracts.generate.categoryPlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("contracts.generate.jurisdiction")}
            </label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder={t("contracts.generate.jurisdictionPlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("contracts.generate.generating")}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("contracts.generate.generate")}
              </>
            )}
          </button>

          {generatedContent && (
            <>
              <button
                onClick={handleRegenerate}
                disabled={generateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                {t("contracts.generate.regenerate")}
              </button>

              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {t("contracts.generate.saveAsDraft")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {generatedContent ? t("contracts.generate.preview") : t("contracts.generate.preview")}
          </label>
          <div className="border border-gray-300 rounded-lg bg-white p-4">
            {generateMutation.isPending ? (
              <div className="flex items-center justify-center h-full min-h-[600px]">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
                  <p className="text-gray-600">{t("contracts.generate.generatingContract")}</p>
                </div>
              </div>
            ) : generatedContent ? (
              <ContractEditor
                content={generatedContent}
                onChange={(newContent) => {
                  // Update ref to track latest content without triggering parent re-render
                  latestContentRef.current = newContent;
                }}
                onSave={(savedContent) => {
                  // Update both ref and state when user explicitly saves
                  latestContentRef.current = savedContent;
                  setGeneratedContent(savedContent);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[600px] text-gray-400">
                {t("contracts.generate.willAppearHere")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
