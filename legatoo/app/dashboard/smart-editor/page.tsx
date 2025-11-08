"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Edit3, 
  Save, 
  Download, 
  Upload, 
  FileText,
  Brain,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Copy,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Image,
  Table
} from "lucide-react";

export default function SmartEditorPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [documentContent, setDocumentContent] = useState(`# Contract Agreement

## Parties
This agreement is entered into between:
- **Company Name**: [Your Company Name]
- **Counterparty**: [Counterparty Name]

## Terms and Conditions

### 1. Scope of Work
The contractor agrees to provide the following services:
- [Service 1]
- [Service 2]
- [Service 3]

### 2. Payment Terms
- **Amount**: $[Amount]
- **Payment Schedule**: [Payment Schedule]
- **Late Payment**: Interest at [Rate]% per month

### 3. Term and Termination
- **Start Date**: [Start Date]
- **End Date**: [End Date]
- **Termination Notice**: [Notice Period] days

### 4. Confidentiality
Both parties agree to maintain confidentiality of all proprietary information.

## Signatures
[Signature blocks will be added here]`);

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: "improvement",
      text: "Consider adding a force majeure clause",
      position: 45,
      accepted: false
    },
    {
      id: 2,
      type: "warning",
      text: "Payment terms may need clearer language",
      position: 120,
      accepted: false
    },
    {
      id: 3,
      type: "suggestion",
      text: "Add dispute resolution clause",
      position: 200,
      accepted: false
    }
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      type: "risk",
      title: "High Risk Clause Detected",
      description: "The termination clause lacks specificity and may lead to disputes.",
      severity: "high",
      suggestion: "Add specific conditions for termination and notice requirements."
    },
    {
      id: 2,
      type: "opportunity",
      title: "Missing Standard Clause",
      description: "Consider adding intellectual property protection clause.",
      severity: "medium",
      suggestion: "Include IP assignment and protection terms."
    },
    {
      id: 3,
      type: "compliance",
      title: "Regulatory Compliance Check",
      description: "Contract appears compliant with current regulations.",
      severity: "low",
      suggestion: "Continue monitoring for regulatory updates."
    }
  ]);

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suggestion':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity':
        return <Lightbulb className="h-4 w-4" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'المحرر الذكي' : 'Smart Editor'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'إنشاء وتحرير العقود باستخدام الذكاء الاصطناعي' : 'Create and edit contracts using artificial intelligence'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'استيراد' : 'Import'}
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'حفظ' : 'Save'}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Undo className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Redo className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Bold className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Italic className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Underline className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <List className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Link className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Image className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Table className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">
                <Brain className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تحليل ذكي' : 'AI Analysis'}
              </button>
              <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">
                <Copy className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {isRTL ? 'محرر المستندات' : 'Document Editor'}
                </h3>
              </div>
              <div className="p-4">
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder={isRTL ? "ابدأ كتابة عقدك هنا..." : "Start writing your contract here..."}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {documentContent.length} {isRTL ? 'حرف' : 'characters'}
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">
                    <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'تصدير' : 'Export'}
                  </button>
                  <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded">
                    <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'حفظ' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Brain className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'اقتراحات الذكاء الاصطناعي' : 'AI Suggestions'}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className={`p-3 rounded-lg border ${getSuggestionColor(suggestion.type)}`}>
                    <div className="flex items-start justify-between">
                      <p className="text-sm">{suggestion.text}</p>
                      <button className="ml-2 text-xs font-medium underline">
                        {isRTL ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <AlertTriangle className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'تحليل المخاطر' : 'Risk Analysis'}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getInsightIcon(insight.type)}
                        <h4 className={`text-sm font-medium ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>
                          {insight.title}
                        </h4>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getInsightColor(insight.severity)}`}>
                        {insight.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {insight.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {insight.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  {isRTL ? 'إضافة بند السرية' : 'Add Confidentiality Clause'}
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  {isRTL ? 'إضافة بند إنهاء العقد' : 'Add Termination Clause'}
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  {isRTL ? 'إضافة بند حل النزاعات' : 'Add Dispute Resolution'}
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  {isRTL ? 'إضافة بند القوة القاهرة' : 'Add Force Majeure'}
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  {isRTL ? 'مراجعة قانونية' : 'Legal Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

