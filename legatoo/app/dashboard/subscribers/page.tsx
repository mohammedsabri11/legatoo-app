"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import {
  useSubscribers,
  useDeleteSubscriber,
  useSubscriber,
} from "@/hooks/useSubscribers";
import {
  Mail,
  Phone,
  Calendar,
  CreditCard,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Search,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function SubscribersPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  const isAdmin = user?.role === "super_admin";
  
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: subscribers, isLoading, error } = useSubscribers();
  const { data: subscriberDetail } = useSubscriber(selectedSubscriberId);
  const deleteMutation = useDeleteSubscriber();

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

  const handleViewDetails = (subscriptionId: string) => {
    setSelectedSubscriberId(subscriptionId);
    setShowDetailsModal(true);
  };

  const handleDelete = async (subscriptionId: string) => {
    if (
      window.confirm(
        isRTL
          ? "هل أنت متأكد من حذف هذا المشترك؟"
          : "Are you sure you want to delete this subscriber?"
      )
    ) {
      await deleteMutation.mutateAsync(subscriptionId);
    }
  };

  const filteredSubscribers = subscribers?.filter((sub) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      sub.name?.toLowerCase().includes(query) ||
      sub.email?.toLowerCase().includes(query) ||
      sub.plan_name?.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive || status === "expired") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          {status === "expired" ? (isRTL ? "منتهي" : "Expired") : isRTL ? "غير نشط" : "Inactive"}
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          {isRTL ? "ملغي" : "Cancelled"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        {isRTL ? "نشط" : "Active"}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "!text-right" : "text-left"}`}>
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? "المشتركين" : "Subscribers"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isRTL
              ? "إدارة وعرض جميع المشتركين في النظام"
              : "Manage and view all subscribers in the system"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} h-5 w-5 text-gray-400`} />
          <input
            type="text"
            placeholder={isRTL ? "بحث عن مشترك..." : "Search subscribers..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${isRTL ? "text-right" : "text-left"}`}
          />
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className={`ml-2 text-gray-600 ${isRTL ? "mr-2 ml-0" : ""}`}>
                {isRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              {isRTL ? "حدث خطأ أثناء تحميل المشتركين" : "Error loading subscribers"}
            </div>
          ) : !filteredSubscribers || filteredSubscribers.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <User className="h-8 w-8 mr-2" />
              {isRTL ? "لا يوجد مشتركين" : "No subscribers found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "المشترك" : "Subscriber"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "الخطة" : "Plan"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "تاريخ البدء" : "Start Date"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "تاريخ الانتهاء" : "End Date"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "الحالة" : "Status"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "الإجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.subscription_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subscriber.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {subscriber.email}
                          </div>
                          {subscriber.phone_number && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {subscriber.phone_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subscriber.plan_name || "-"}</div>
                        <div className="text-sm text-gray-500">
                          {subscriber.plan_type && subscriber.plan_type.charAt(0).toUpperCase() + subscriber.plan_type.slice(1)}
                        </div>
                        {subscriber.price > 0 && (
                          <div className="text-sm font-medium text-gray-900">
                            {subscriber.price} SAR
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscriber.start_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscriber.end_date || null)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscriber.status, subscriber.is_active)}
                        {subscriber.is_active && subscriber.days_remaining !== undefined && subscriber.days_remaining < 999999 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {subscriber.days_remaining} {isRTL ? "يوم متبقي" : "days left"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(subscriber.subscription_id)}
                            className="text-primary hover:text-primary-dark p-1"
                            title={isRTL ? "عرض التفاصيل" : "View Details"}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(subscriber.subscription_id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title={isRTL ? "حذف" : "Delete"}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && subscriberDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isRTL ? "تفاصيل المشترك" : "Subscriber Details"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedSubscriberId(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isRTL ? "المعلومات الشخصية" : "Personal Information"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "الاسم" : "Name"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">{subscriberDetail.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "البريد الإلكتروني" : "Email"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">{subscriberDetail.email}</p>
                      </div>
                      {subscriberDetail.phone_number && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            {isRTL ? "رقم الهاتف" : "Phone"}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{subscriberDetail.phone_number}</p>
                        </div>
                      )}
                      {subscriberDetail.account_type && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            {isRTL ? "نوع الحساب" : "Account Type"}
                          </label>
                          <p className="mt-1 text-sm text-gray-900 capitalize">
                            {subscriberDetail.account_type}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subscription Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isRTL ? "معلومات الاشتراك" : "Subscription Information"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "الخطة" : "Plan"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">{subscriberDetail.plan_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "نوع الخطة" : "Plan Type"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {subscriberDetail.plan_type}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "السعر" : "Price"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {subscriberDetail.price} {isRTL ? "ريال" : "SAR"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "دورة الفوترة" : "Billing Cycle"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {subscriberDetail.billing_cycle || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "تاريخ البدء" : "Start Date"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(subscriberDetail.start_date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "تاريخ الانتهاء" : "End Date"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(subscriberDetail.end_date || null)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "الحالة" : "Status"}
                        </label>
                        <div className="mt-1">
                          {getStatusBadge(subscriberDetail.status, subscriberDetail.is_active)}
                        </div>
                      </div>
                      {subscriberDetail.days_remaining !== undefined && subscriberDetail.days_remaining < 999999 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            {isRTL ? "الأيام المتبقية" : "Days Remaining"}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{subscriberDetail.days_remaining}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {isRTL ? "التجديد التلقائي" : "Auto Renew"}
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {subscriberDetail.auto_renew ? (isRTL ? "نعم" : "Yes") : (isRTL ? "لا" : "No")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
