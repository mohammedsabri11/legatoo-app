"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Eye,
  Download,
} from "lucide-react";
 // test 
export default function CompliancePage() {
  const {  locale } = useTranslation();
  const isRTL = locale === "ar";
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock data - replace with real data from your API
  const complianceMetrics = {
    overallScore: 87,
    lastMonthScore: 82,
    trend: "up",
    totalPolicies: 24,
    compliantPolicies: 21,
    nonCompliantPolicies: 3,
    upcomingReviews: 5,
  };

  const complianceAreas = [
    {
      id: 1,
      name: "Data Protection (GDPR)",
      score: 92,
      status: "compliant",
      lastReview: "2024-01-15",
      nextReview: "2024-04-15",
      violations: 0,
      policies: 8,
    },
    {
      id: 2,
      name: "Employment Law",
      score: 85,
      status: "compliant",
      lastReview: "2024-01-10",
      nextReview: "2024-04-10",
      violations: 1,
      policies: 6,
    },
    {
      id: 3,
      name: "Financial Regulations",
      score: 78,
      status: "warning",
      lastReview: "2024-01-05",
      nextReview: "2024-02-05",
      violations: 2,
      policies: 4,
    },
    {
      id: 4,
      name: "Health & Safety",
      score: 95,
      status: "compliant",
      lastReview: "2024-01-20",
      nextReview: "2024-04-20",
      violations: 0,
      policies: 3,
    },
    {
      id: 5,
      name: "Environmental",
      score: 65,
      status: "non-compliant",
      lastReview: "2023-12-15",
      nextReview: "2024-01-15",
      violations: 3,
      policies: 3,
    },
  ];

  const recentViolations = [
    {
      id: 1,
      type: "Policy Violation",
      description: "Employee data processing without proper consent",
      severity: "high",
      date: "2024-01-18",
      status: "resolved",
      assignedTo: "Sarah Johnson",
    },
    {
      id: 2,
      type: "Regulatory Breach",
      description: "Missing financial reporting documentation",
      severity: "medium",
      date: "2024-01-15",
      status: "in-progress",
      assignedTo: "Mike Davis",
    },
    {
      id: 3,
      type: "Compliance Gap",
      description: "Environmental impact assessment overdue",
      severity: "high",
      date: "2024-01-12",
      status: "pending",
      assignedTo: "Lisa Brown",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "non-compliant":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
            isRTL ? "sm:flex-row-reverse" : ""
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "إدارة الامتثال" : "Compliance Management"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "مراقبة وإدارة الامتثال التنظيمي والقانوني"
                : "Monitor and manage regulatory and legal compliance"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <option value="7d">{isRTL ? "آخر 7 أيام" : "Last 7 days"}</option>
              <option value="30d">
                {isRTL ? "آخر 30 يوم" : "Last 30 days"}
              </option>
              <option value="90d">
                {isRTL ? "آخر 90 يوم" : "Last 90 days"}
              </option>
              <option value="1y">{isRTL ? "آخر سنة" : "Last year"}</option>
            </select>
          </div>
        </div>

        {/* Overall Compliance Score */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {isRTL ? "درجة الامتثال الإجمالية" : "Overall Compliance Score"}
              </h2>
              <p className="text-sm text-gray-500">
                {isRTL
                  ? "بناءً على جميع السياسات واللوائح"
                  : "Based on all policies and regulations"}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  complianceMetrics.overallScore
                )}`}
              >
                {complianceMetrics.overallScore}%
              </div>
              <div className="flex items-center text-sm text-gray-500">
                {complianceMetrics.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                {complianceMetrics.trend === "up" ? "+" : "-"}
                {Math.abs(
                  complianceMetrics.overallScore -
                    complianceMetrics.lastMonthScore
                )}
                %{isRTL ? "من الشهر الماضي" : "from last month"}
              </div>
            </div>
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
                  <ShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "السياسات المتوافقة" : "Compliant Policies"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {complianceMetrics.compliantPolicies}/
                      {complianceMetrics.totalPolicies}
                    </dd>
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
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "الانتهاكات النشطة" : "Active Violations"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {complianceMetrics.nonCompliantPolicies}
                    </dd>
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
                      {isRTL ? "المراجعات القادمة" : "Upcoming Reviews"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {complianceMetrics.upcomingReviews}
                    </dd>
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
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "الهدف" : "Target"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">95%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Areas */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isRTL ? "مجالات الامتثال" : "Compliance Areas"}
            </h3>
            <div className="space-y-4">
              {complianceAreas.map((area) => (
                <div
                  key={area.id}
                  className=" shadow-md hover:shadow-lg transition-shadow duration-300  border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {area.name}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            area.status
                          )}`}
                        >
                          {area.status === "compliant"
                            ? isRTL
                              ? "متوافق"
                              : "Compliant"
                            : area.status === "warning"
                            ? isRTL
                              ? "تحذير"
                              : "Warning"
                            : area.status === "non-compliant"
                            ? isRTL
                              ? "غير متوافق"
                              : "Non-Compliant"
                            : area.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className={`h-2 rounded-full ${getScoreColor(
                                area.score
                              ).replace("text-", "bg-")}`}
                              style={{ width: `${area.score}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-sm font-medium ${getScoreColor(
                              area.score
                            )}`}
                          >
                            {area.score}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {area.policies} {isRTL ? "سياسة" : "policies"} •{" "}
                          {area.violations} {isRTL ? "انتهاك" : "violations"}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {isRTL ? "آخر مراجعة:" : "Last review:"}{" "}
                        {new Date(area.lastReview).toLocaleDateString()} •
                        {isRTL ? "المراجعة القادمة:" : "Next review:"}{" "}
                        {new Date(area.nextReview).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Violations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? "الانتهاكات الحديثة" : "Recent Violations"}
          </h3>
          <div className="space-y-3">
            {recentViolations.map((violation) => (
              <div
                key={violation.id}
                className="flex items-center justify-between p-3  shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div
                    className={`ml-3 ${
                      isRTL ? "mr-3 ml-0 text-right" : "text-left"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {violation.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {violation.type} • {violation.assignedTo} •{" "}
                      {new Date(violation.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                      violation.severity
                    )}`}
                  >
                    {violation.severity}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      violation.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : violation.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {violation.status === "resolved"
                      ? isRTL
                        ? "محلول"
                        : "Resolved"
                      : violation.status === "in-progress"
                      ? isRTL
                        ? "قيد العمل"
                        : "In Progress"
                      : violation.status === "pending"
                      ? isRTL
                        ? "معلق"
                        : "Pending"
                      : violation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Calendar */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? "تقويم الامتثال" : "Compliance Calendar"}
          </h3>
          <div className="space-y-3">
            {complianceAreas
              .filter((area) => area.status !== "compliant")
              .sort(
                (a, b) =>
                  new Date(a.nextReview).getTime() -
                  new Date(b.nextReview).getTime()
              )
              .slice(0, 5)
              .map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between p-3   shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div
                      className={`ml-3 ${
                        isRTL ? "mr-3 ml-0 text-right" : "text-left"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {area.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isRTL ? "مراجعة مطلوبة في" : "Review due on"}{" "}
                        {new Date(area.nextReview).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      area.status
                    )}`}
                  >
                    {area.status === "warning"
                      ? isRTL
                        ? "تحذير"
                        : "Warning"
                      : area.status === "non-compliant"
                      ? isRTL
                        ? "غير متوافق"
                        : "Non-Compliant"
                      : area.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
