"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import Link from "next/link";
import {
  Users,
  AlertCircle,
  Activity,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { analyticsApi, DashboardStats } from "@/lib/api/analytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  
  // Check if user is admin
  const isAdmin = user?.role === "super_admin";

  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const statsRes = await analyticsApi.getDashboardStats();

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

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

  // Prepare chart data
  const chartData =
    stats?.online_users_chart?.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString(locale === "ar" ? "ar-SA" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      users: item.count,
    })) || [];

  // Stats cards
  const statsCards = [
    {
      title: isRTL ? "المستخدمين النشطين الآن" : "Online Users",
      value: stats?.online_users || 0,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: isRTL ? "إجمالي المستخدمين" : "Total Users",
      value: stats?.total_users || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: isRTL ? "الأخطاء اليوم" : "Errors Today",
      value: stats?.errors_today || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: isRTL ? "الجلسات النشطة" : "Active Sessions",
      value: stats?.active_sessions || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "!text-right" : "text-left"}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "لوحة تحكم المدير - التحليلات" : "Admin Dashboard - Analytics"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? "نظرة عامة على النظام والمراقبة في الوقت الفعلي" : "System overview and real-time monitoring"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin/analytics"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              {isRTL ? "عرض التحليلات التفصيلية" : "View Detailed Analytics"}
              <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {isRTL ? "تحديث" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {isRTL ? "التحليلات والإحصائيات" : "Analytics & Statistics"}
          </h2>
          
          {/* Online Users Chart */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              {isRTL ? "المستخدمين النشطين عبر الزمن (آخر 24 ساعة)" : "Active Users Over Time (Last 24 Hours)"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name={isRTL ? "المستخدمين" : "Users"}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {isRTL ? "للمزيد من التفاصيل والتحليلات المتقدمة" : "For more detailed analytics and advanced insights"}
                </p>
                <p className="text-xs text-gray-500">
                  {isRTL 
                    ? "عرض سجل تسجيل الدخول الكامل وسجلات النظام التفصيلية" 
                    : "View full login history and detailed system logs"}
                </p>
              </div>
              <Link
                href="/dashboard/admin/analytics"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                {isRTL ? "فتح التحليلات التفصيلية" : "Open Detailed Analytics"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
