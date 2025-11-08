"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { analyticsApi, LoginHistoryRecord, SystemLogRecord } from "@/lib/api/analytics";

export default function AdminAnalytics() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  
  // Check if user is admin
  const isAdmin = user?.role === "super_admin";

  // State
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"logins" | "logs">("logins");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterLogLevel, setFilterLogLevel] = useState<string>("");
  
  // Pagination state
  const itemsPerPage = 20;
  const [loginHistoryPage, setLoginHistoryPage] = useState(1);
  const [systemLogsPage, setSystemLogsPage] = useState(1);
  const [loginHistoryTotal, setLoginHistoryTotal] = useState(0);
  const [systemLogsTotal, setSystemLogsTotal] = useState(0);

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {
      setRefreshing(true);
      
      // Calculate offset for login history
      const loginOffset = (loginHistoryPage - 1) * itemsPerPage;
      const loginParams: {
        limit: number;
        offset: number;
        status?: "success" | "failed";
      } = {
        limit: itemsPerPage,
        offset: loginOffset,
      };
      if (filterStatus && (filterStatus === "success" || filterStatus === "failed")) {
        loginParams.status = filterStatus as "success" | "failed";
      }
      
      // Calculate offset for system logs
      const logsOffset = (systemLogsPage - 1) * itemsPerPage;
      const logsParams: {
        limit: number;
        offset: number;
        level?: "info" | "warning" | "error" | "critical";
      } = {
        limit: itemsPerPage,
        offset: logsOffset,
      };
      if (filterLogLevel && (filterLogLevel === "info" || filterLogLevel === "warning" || filterLogLevel === "error" || filterLogLevel === "critical")) {
        logsParams.level = filterLogLevel as "info" | "warning" | "error" | "critical";
      }
      
      const [loginRes, logsRes] = await Promise.all([
        analyticsApi.getLoginHistory(loginParams),
        analyticsApi.getSystemLogs(logsParams),
      ]);

      if (loginRes.success && loginRes.data) {
        setLoginHistory(loginRes.data.records);
        setLoginHistoryTotal(loginRes.data.total);
      }
      if (logsRes.success && logsRes.data) {
        setSystemLogs(logsRes.data.records);
        setSystemLogsTotal(logsRes.data.total);
      }
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAnalyticsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, loginHistoryPage, systemLogsPage, filterStatus, filterLogLevel]);

  useEffect(() => {
    if (isAdmin) {
      // Reset to page 1 when filters change
      setLoginHistoryPage(1);
      setSystemLogsPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterLogLevel]);

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? "غير مصرح لك بالوصول" : "Access Denied"}
            </h2>
            <p className="text-gray-600">
              {isRTL
                ? "تحتاج إلى صلاحيات المدير للوصول إلى هذه الصفحة"
                : "You need admin privileges to access this page"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Pagination calculations
  const loginHistoryStart = (loginHistoryPage - 1) * itemsPerPage + 1;
  const loginHistoryEnd = Math.min(loginHistoryPage * itemsPerPage, loginHistoryTotal);
  const systemLogsStart = (systemLogsPage - 1) * itemsPerPage + 1;
  const systemLogsEnd = Math.min(systemLogsPage * itemsPerPage, systemLogsTotal);

  // Pagination component
  const PaginationControls = ({
    currentPage,
    totalPages,
    totalItems,
    start,
    end,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    start: number;
    end: number;
    onPageChange: (page: number) => void;
  }) => {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRTL ? "السابق" : "Previous"}
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRTL ? "التالي" : "Next"}
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {isRTL ? (
                <>
                  عرض <span className="font-medium">{start}</span> إلى <span className="font-medium">{end}</span> من{" "}
                  <span className="font-medium">{totalItems}</span> نتيجة
                </>
              ) : (
                <>
                  Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> results
                </>
              )}
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRTL ? "rounded-l-none rounded-r-md" : ""
                }`}
              >
                <span className="sr-only">{isRTL ? "السابق" : "Previous"}</span>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNum
                        ? "z-10 bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRTL ? "rounded-r-none rounded-l-md" : ""
                }`}
              >
                <span className="sr-only">{isRTL ? "التالي" : "Next"}</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "!text-right" : "text-left"}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isRTL ? "التحليلات التفصيلية" : "Detailed Analytics"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {isRTL ? "عرض تفصيلي لسجلات تسجيل الدخول وسجلات النظام" : "Detailed view of login history and system logs"}
              </p>
            </div>
          </div>
          <button
            onClick={loadAnalyticsData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {isRTL ? "تحديث" : "Refresh"}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSelectedTab("logins")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  selectedTab === "logins"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {isRTL ? "سجل تسجيل الدخول" : "Login History"}
              </button>
              <button
                onClick={() => setSelectedTab("logs")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  selectedTab === "logs"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {isRTL ? "سجلات النظام" : "System Logs"}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Login History Tab */}
            {selectedTab === "logins" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">{isRTL ? "جميع الحالات" : "All Statuses"}</option>
                    <option value="success">{isRTL ? "نجح" : "Success"}</option>
                    <option value="failed">{isRTL ? "فشل" : "Failed"}</option>
                  </select>
                  <span className="text-sm text-gray-500">
                    {loginHistoryTotal} {isRTL ? "سجل" : "records"}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "المستخدم" : "User"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "الوقت" : "Time"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "IP" : "IP Address"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "الموقع" : "Location"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "الجهاز" : "Device"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "الحالة" : "Status"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loginHistory.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            {isRTL ? "لا توجد سجلات" : "No records found"}
                          </td>
                        </tr>
                      ) : (
                        loginHistory.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.user_email || "Unknown"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.login_time).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.ip_address || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.location || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.device || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {record.status === "success" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                                  {isRTL ? "نجح" : "Success"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                                  {isRTL ? "فشل" : "Failed"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={loginHistoryPage}
                  totalPages={Math.ceil(loginHistoryTotal / itemsPerPage)}
                  totalItems={loginHistoryTotal}
                  start={loginHistoryStart}
                  end={loginHistoryEnd}
                  onPageChange={setLoginHistoryPage}
                />
              </div>
            )}

            {/* System Logs Tab */}
            {selectedTab === "logs" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <select
                    value={filterLogLevel}
                    onChange={(e) => setFilterLogLevel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">{isRTL ? "جميع المستويات" : "All Levels"}</option>
                    <option value="info">{isRTL ? "معلومات" : "Info"}</option>
                    <option value="warning">{isRTL ? "تحذير" : "Warning"}</option>
                    <option value="error">{isRTL ? "خطأ" : "Error"}</option>
                    <option value="critical">{isRTL ? "حرج" : "Critical"}</option>
                  </select>
                  <span className="text-sm text-gray-500">
                    {systemLogsTotal} {isRTL ? "سجل" : "records"}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "المستوى" : "Level"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "الرسالة" : "Message"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "النقطة" : "Endpoint"}
                        </th>
                        <th className={`px-6 py-3 ${isRTL ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                          {isRTL ? "الوقت" : "Time"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {systemLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            {isRTL ? "لا توجد سجلات" : "No records found"}
                          </td>
                        </tr>
                      ) : (
                        systemLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  log.level === "error" || log.level === "critical"
                                    ? "bg-red-100 text-red-800"
                                    : log.level === "warning"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {log.level.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                              {log.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.endpoint || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(log.created_at).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={systemLogsPage}
                  totalPages={Math.ceil(systemLogsTotal / itemsPerPage)}
                  totalItems={systemLogsTotal}
                  start={systemLogsStart}
                  end={systemLogsEnd}
                  onPageChange={setSystemLogsPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
