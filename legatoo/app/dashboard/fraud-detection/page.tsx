"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  Filter, 
  CheckCircle,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity
} from "lucide-react";

export default function FraudDetectionPage() {
  const {  locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Mock data - replace with real data from your API
  const fraudMetrics = {
    totalAlerts: 156,
    highRiskAlerts: 23,
    mediumRiskAlerts: 67,
    lowRiskAlerts: 66,
    resolvedAlerts: 142,
    pendingAlerts: 14,
    falsePositives: 8,
    accuracyRate: 94.2
  };

  const fraudAlerts = [
    {
      id: 1,
      type: "Document Forgery",
      severity: "high",
      description: "Suspicious signature patterns detected in contract documents",
      detectedAt: "2024-01-20",
      status: "investigating",
      confidence: 92,
      affectedDocuments: 3,
      assignedTo: "Sarah Johnson",
      estimatedLoss: 150000,
      source: "AI Analysis"
    },
    {
      id: 2,
      type: "Identity Fraud",
      severity: "medium",
      description: "Multiple accounts created with similar personal information",
      detectedAt: "2024-01-18",
      status: "resolved",
      confidence: 78,
      affectedDocuments: 1,
      assignedTo: "Mike Davis",
      estimatedLoss: 50000,
      source: "Pattern Recognition"
    },
    {
      id: 3,
      type: "Financial Fraud",
      severity: "high",
      description: "Unusual payment patterns detected in client transactions",
      detectedAt: "2024-01-15",
      status: "pending",
      confidence: 89,
      affectedDocuments: 5,
      assignedTo: "Lisa Brown",
      estimatedLoss: 200000,
      source: "Transaction Monitoring"
    },
    {
      id: 4,
      type: "Data Manipulation",
      severity: "medium",
      description: "Suspicious modifications to legal case files",
      detectedAt: "2024-01-12",
      status: "investigating",
      confidence: 85,
      affectedDocuments: 2,
      assignedTo: "Tom Wilson",
      estimatedLoss: 75000,
      source: "File Integrity Check"
    }
  ];

  const fraudPatterns = [
    {
      id: 1,
      pattern: "Duplicate Document Signatures",
      frequency: 12,
      riskLevel: "high",
      lastDetected: "2024-01-20",
      trend: "increasing"
    },
    {
      id: 2,
      pattern: "Unusual Payment Timing",
      frequency: 8,
      riskLevel: "medium",
      lastDetected: "2024-01-18",
      trend: "stable"
    },
    {
      id: 3,
      pattern: "Suspicious Account Creation",
      frequency: 15,
      riskLevel: "medium",
      lastDetected: "2024-01-15",
      trend: "decreasing"
    },
    {
      id: 4,
      pattern: "Document Modification Anomalies",
      frequency: 6,
      riskLevel: "high",
      lastDetected: "2024-01-12",
      trend: "increasing"
    }
  ];

  const severities = [
    { id: 'all', name: isRTL ? 'الكل' : 'All', count: fraudAlerts.length },
    { id: 'high', name: isRTL ? 'عالي' : 'High', count: fraudAlerts.filter(a => a.severity === 'high').length },
    { id: 'medium', name: isRTL ? 'متوسط' : 'Medium', count: fraudAlerts.filter(a => a.severity === 'medium').length },
    { id: 'low', name: isRTL ? 'منخفض' : 'Low', count: fraudAlerts.filter(a => a.severity === 'low').length }
  ];

  const getSeverityColor = (severity: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredAlerts = selectedSeverity === 'all' 
    ? fraudAlerts 
    : fraudAlerts.filter(alert => alert.severity === selectedSeverity);

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'كشف الاحتيال' : 'Fraud Detection'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'مراقبة وكشف الأنشطة الاحتيالية المشبوهة' : 'Monitor and detect suspicious fraudulent activities'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <BarChart3 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تقرير مفصل' : 'Detailed Report'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'إجمالي التنبيهات' : 'Total Alerts'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{fraudMetrics.totalAlerts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'تنبيهات عالية المخاطر' : 'High Risk Alerts'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{fraudMetrics.highRiskAlerts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'معدل الدقة' : 'Accuracy Rate'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{fraudMetrics.accuracyRate}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'الخسائر المحتملة' : 'Potential Losses'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${fraudAlerts.reduce((sum, alert) => sum + alert.estimatedLoss, 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isRTL ? 'مستوى الخطورة' : 'Severity Level'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {severities.map((severity) => (
              <button
                key={severity.id}
                onClick={() => setSelectedSeverity(severity.id)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSeverity === severity.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {severity.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedSeverity === severity.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {severity.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={isRTL ? "البحث في التنبيهات..." : "Search alerts..."}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تصفية' : 'Filter'}
              </button>
            </div>
          </div>
        </div>

        {/* Fraud Alerts Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isRTL ? 'تنبيهات الاحتيال الحديثة' : 'Recent Fraud Alerts'}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'التنبيه' : 'Alert'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'النوع' : 'Type'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الخطورة' : 'Severity'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الثقة' : 'Confidence'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الخسارة المحتملة' : 'Potential Loss'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                          </div>
                          <div className={`ml-4 ${isRTL ? 'mr-4 ml-0 text-right' : 'text-left'}`}>
                            <div className="text-sm font-medium text-gray-900">
                              {alert.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {alert.affectedDocuments} {isRTL ? 'وثيقة' : 'docs'} • {alert.assignedTo} • {alert.source}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {alert.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity === 'high' ? (isRTL ? 'عالي' : 'High') :
                           alert.severity === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                           alert.severity === 'low' ? (isRTL ? 'منخفض' : 'Low') : alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {alert.confidence}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status === 'investigating' ? (isRTL ? 'قيد التحقيق' : 'Investigating') :
                           alert.status === 'resolved' ? (isRTL ? 'محلول' : 'Resolved') :
                           alert.status === 'pending' ? (isRTL ? 'معلق' : 'Pending') : alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${alert.estimatedLoss.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary hover:text-primary/80">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fraud Patterns */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'أنماط الاحتيال المكتشفة' : 'Detected Fraud Patterns'}
          </h3>
          <div className="space-y-3">
            {fraudPatterns.map((pattern) => (
              <div key={pattern.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                    <div className="text-sm font-medium text-gray-900">
                      {pattern.pattern}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pattern.frequency} {isRTL ? 'تكرار' : 'occurrences'} • {isRTL ? 'آخر اكتشاف:' : 'Last detected:'} {new Date(pattern.lastDetected).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(pattern.riskLevel)}`}>
                    {pattern.riskLevel}
                  </span>
                  {getTrendIcon(pattern.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'تقييم المخاطر' : 'Risk Assessment'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">High</div>
              <div className="text-sm text-gray-500 mb-2">Risk Level</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">Medium</div>
              <div className="text-sm text-gray-500 mb-2">Risk Level</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Low</div>
              <div className="text-sm text-gray-500 mb-2">Risk Level</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




