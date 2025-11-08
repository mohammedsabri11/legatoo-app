"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Users2,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function ClassActionsPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";

  // Mock data - replace with real data from your API
  const classActions = [
    {
      id: 1,
      title: "Data Privacy Violation - TechCorp",
      status: "active",
      category: "Privacy",
      leadPlaintiff: "John Smith",
      totalMembers: 1250,
      potentialSettlement: 2500000,
      filedDate: "2024-01-15",
      nextHearing: "2024-02-15",
      documents: 45,
      progress: 60,
    },
    {
      id: 2,
      title: "Employment Discrimination - RetailChain",
      status: "certified",
      category: "Employment",
      leadPlaintiff: "Sarah Johnson",
      totalMembers: 850,
      potentialSettlement: 1800000,
      filedDate: "2024-01-10",
      nextHearing: "2024-02-20",
      documents: 32,
      progress: 75,
    },
    {
      id: 3,
      title: "Product Liability - AutoManufacturer",
      status: "settled",
      category: "Product Liability",
      leadPlaintiff: "Mike Davis",
      totalMembers: 2100,
      potentialSettlement: 5000000,
      filedDate: "2023-12-01",
      nextHearing: "2024-01-30",
      documents: 67,
      progress: 100,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "certified":
        return "bg-green-100 text-green-800";
      case "settled":
        return "bg-purple-100 text-purple-800";
      case "dismissed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Privacy":
        return "bg-purple-100 text-purple-800";
      case "Employment":
        return "bg-blue-100 text-blue-800";
      case "Product Liability":
        return "bg-orange-100 text-orange-800";
      case "Securities":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "certified":
        return <CheckCircle className="h-4 w-4" />;
      case "settled":
        return <DollarSign className="h-4 w-4" />;
      case "dismissed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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
              {isRTL ? "الدفعات الجماعية" : "Class Actions"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "إدارة الدفعات الجماعية والمقاضاة الجماعي"
                : "Manage class actions and collective litigation"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {isRTL ? "إضافة دعوى جماعية جديدة" : "Add New Class Action"}
            </button>
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
                  <Users2 className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "إجمالي الدفعات" : "Total Class Actions"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">12</dd>
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
                      {isRTL ? "دفعات نشطة" : "Active Cases"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">8</dd>
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
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "إجمالي التسويات" : "Total Settlements"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      $12.5M
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
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? "mr-5 ml-0" : ""}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? "متوسط حجم المجموعة" : "Avg. Class Size"}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">1,250</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <div
            className={`flex flex-col sm:flex-row gap-4 ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1">
              <div className="relative">
                <div
                  className={`absolute inset-y-0 flex items-center pointer-events-none ${
                    isRTL ? "right-0 pr-3" : "left-0 pl-3"
                  }`}
                >
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={
                    isRTL
                      ? "البحث في الدفعات الجماعية..."
                      : "Search class actions..."
                  }
                  className={`block w-full ${
                    isRTL ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"
                  } border !border-primary rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center px-3 py-2 border !border-primary shadow-sm text-sm leading-4 font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Filter className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {isRTL ? "تصفية" : "Filter"}
              </button>
            </div>
          </div>
        </div>

        {/* Class Actions Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isRTL ? "الدفعات الجماعية الحديثة" : "Recent Class Actions"}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "الدعوى" : "Case"}
                    </th>
                    <th
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "الفئة" : "Category"}
                    </th>
                    <th
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "الحالة" : "Status"}
                    </th>
                    <th
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "حجم المجموعة" : "Class Size"}
                    </th>
                    <th
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "التسوية المحتملة" : "Potential Settlement"}
                    </th>
                    <th
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "التقدم" : "Progress"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classActions.map((action) => (
                    <tr key={action.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div
                            className={`ml-4 ${
                              isRTL ? "mr-4 ml-0 text-right" : "text-left"
                            }`}
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {action.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {action.leadPlaintiff} • {action.documents}{" "}
                              {isRTL ? "وثيقة" : "docs"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            action.category
                          )}`}
                        >
                          {action.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            action.status
                          )}`}
                        >
                          {getStatusIcon(action.status)}
                          <span className={`${isRTL ? "mr-1" : "ml-1"}`}>
                            {action.status === "active"
                              ? isRTL
                                ? "نشط"
                                : "Active"
                              : action.status === "certified"
                              ? isRTL
                                ? "معتمد"
                                : "Certified"
                              : action.status === "settled"
                              ? isRTL
                                ? "تم التسوية"
                                : "Settled"
                              : action.status === "dismissed"
                              ? isRTL
                                ? "مرفوض"
                                : "Dismissed"
                              : action.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {action.totalMembers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(action.potentialSettlement / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${action.progress}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-sm text-gray-500 ${
                              isRTL ? "mr-2" : "ml-2"
                            }`}
                          >
                            {action.progress}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Hearings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? "الجلسات القادمة" : "Upcoming Hearings"}
          </h3>
          <div className="space-y-3">
            {classActions
              .filter((action) => action.status !== "settled")
              .map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3   shadow rounded-lg"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div
                      className={`ml-3 ${
                        isRTL ? "mr-3 ml-0 text-right" : "text-left"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(action.nextHearing).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      action.status
                    )}`}
                  >
                    {action.status === "active"
                      ? isRTL
                        ? "نشط"
                        : "Active"
                      : action.status === "certified"
                      ? isRTL
                        ? "معتمد"
                        : "Certified"
                      : action.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
