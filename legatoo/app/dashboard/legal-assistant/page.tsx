"use client";

import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useSearchSimilarLaws, ChatMessage } from "@/hooks/useChatbot";
import {
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  TrendingUp,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function LegalAssistantPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: isRTL
        ? "مرحباً! أنا مساعدك القانوني الذكي. يمكنني مساعدتك في البحث عن القوانين والأنظمة المشابهة. اسألني أي سؤال قانوني!"
        : "Hello! I'm your AI Legal Assistant. I can help you search for similar laws and regulations. Ask me any legal question!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [topK, setTopK] = useState(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchMutation = useSearchSimilarLaws();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || searchMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await searchMutation.mutateAsync({
        query: inputMessage,
        top_k: topK,
      });

      if (response.success && response.data) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.answer || (isRTL ? "تم معالجة السؤال" : "Answer processed"),
          timestamp: new Date(),
          answer: response.data.answer,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: isRTL
            ? "عذراً، لم أتمكن من العثور على إجابة. حاول إعادة صياغة سؤالك."
            : "Sorry, I couldn't find an answer. Try rephrasing your question.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isRTL
          ? "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى."
          : "An error occurred while searching. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };


  return (
    <DashboardLayout>
      <div
        className={`h-[calc(100vh-12rem)] flex flex-col ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isRTL ? "المساعد القانوني الذكي" : "AI Legal Assistant"}
              </h1>
              <p className="text-sm text-gray-500">
                {isRTL
                  ? "ابحث عن القوانين والأنظمة المشابهة"
                  : "Search for similar laws and regulations"}
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">
                {isRTL ? "عمق البحث:" : "Search Depth:"}
              </label>
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow      p-6 mb-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? isRTL
                      ? "justify-start"
                      : "justify-end"
                    : isRTL
                    ? "justify-end"
                    : "justify-start"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex ${
                    isRTL ? "flex-row-reverse" : ""
                  } max-w-[80%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  } space-x-3`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex flex-col ${
                      isRTL ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm   whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>


                    {/* Timestamp */}
                    <span className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString(
                        isRTL ? "ar-SA" : "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {searchMutation.isPending && (
              <div
                className={`flex ${isRTL ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex ${
                    isRTL ? "flex-row-reverse" : ""
                  } items-start space-x-3`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-gray-600">
                        {isRTL ? "جاري البحث..." : "Searching..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="bg-white rounded-lg shadow      p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isRTL
                    ? "اكتب سؤالك القانوني هنا... (مثال: فسخ عقد العمل)"
                    : "Type your legal question here... (e.g., termination of employment contract)"
                }
                className={`w-full px-4 py-3 border !border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
                disabled={searchMutation.isPending}
              />
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || searchMutation.isPending}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {searchMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">
                {isRTL ? "إرسال" : "Send"}
              </span>
            </button>
          </div>
        </form>

        {/* Quick Suggestions */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">
            {isRTL ? "اقتراحات سريعة:" : "Quick suggestions:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              isRTL ? "فسخ عقد العمل" : "Employment contract termination",
              isRTL ? "حقوق الموظف" : "Employee rights",
              isRTL ? "التعويضات" : "Compensations",
              isRTL ? "الإجازات" : "Leaves",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
