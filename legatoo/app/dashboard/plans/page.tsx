"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import { usePlans, useCreatePlan } from "@/hooks/usePlans";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Package,
} from "lucide-react";

export default function PlansPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  const isAdmin = user?.role === "super_admin";
  
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planFormData, setPlanFormData] = useState({
    plan_name: "",
    plan_type: "free",
    price: "0",
    billing_cycle: "none",
    file_limit: "",
    ai_message_limit: "",
    contract_limit: "",
    report_limit: "",
    token_limit: "",
    multi_user_limit: "",
    description: "",
    is_active: true,
  });

  const { data: plans, isLoading: plansLoading } = usePlans(false);
  const createPlanMutation = useCreatePlan();

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

  const handleCreatePlan = async () => {
    try {
      const planData = {
        plan_name: planFormData.plan_name,
        plan_type: planFormData.plan_type,
        price: parseFloat(planFormData.price),
        billing_cycle: planFormData.billing_cycle,
        file_limit: planFormData.file_limit ? parseInt(planFormData.file_limit) : null,
        ai_message_limit: planFormData.ai_message_limit ? parseInt(planFormData.ai_message_limit) : null,
        contract_limit: planFormData.contract_limit ? parseInt(planFormData.contract_limit) : null,
        report_limit: planFormData.report_limit ? parseInt(planFormData.report_limit) : null,
        token_limit: planFormData.token_limit ? parseInt(planFormData.token_limit) : null,
        multi_user_limit: planFormData.multi_user_limit ? parseInt(planFormData.multi_user_limit) : null,
        description: planFormData.description || null,
        is_active: planFormData.is_active,
      };

      await createPlanMutation.mutateAsync(planData);
      setShowPlanModal(false);
      setPlanFormData({
        plan_name: "",
        plan_type: "free",
        price: "0",
        billing_cycle: "none",
        file_limit: "",
        ai_message_limit: "",
        contract_limit: "",
        report_limit: "",
        token_limit: "",
        multi_user_limit: "",
        description: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "!text-right" : "text-left"}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "الخطط" : "Plans"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "إدارة وعرض جميع خطط الاشتراك"
                : "Manage and view all subscription plans"}
            </p>
          </div>
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? "إضافة خطة" : "Add Plan"}
          </button>
        </div>

        {/* Plans Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {plansLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className={`ml-2 text-gray-600 ${isRTL ? "mr-2 ml-0" : ""}`}>
                {isRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : !plans || plans.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Package className="h-8 w-8 mr-2" />
              {isRTL ? "لا توجد خطط" : "No plans found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "اسم الخطة" : "Plan Name"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "النوع" : "Type"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "السعر" : "Price"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "دورة الفوترة" : "Billing Cycle"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "الحدود" : "Limits"}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? "الحالة" : "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((plan) => (
                    <tr key={plan.plan_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{plan.plan_name}</div>
                        {plan.description && (
                          <div className="text-sm text-gray-500">{plan.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{plan.plan_type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {plan.price > 0 ? `${plan.price} SAR` : isRTL ? "مجاني" : "Free"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{plan.billing_cycle}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 space-y-1">
                          {plan.file_limit && (
                            <div>{isRTL ? "ملفات" : "Files"}: {plan.file_limit}</div>
                          )}
                          {plan.ai_message_limit && (
                            <div>{isRTL ? "رسائل AI" : "AI Messages"}: {plan.ai_message_limit}</div>
                          )}
                          {plan.contract_limit && (
                            <div>{isRTL ? "عقود" : "Contracts"}: {plan.contract_limit}</div>
                          )}
                          {plan.report_limit && (
                            <div>{isRTL ? "تقارير" : "Reports"}: {plan.report_limit}</div>
                          )}
                          {plan.token_limit && (
                            <div>{isRTL ? "توكنات" : "Tokens"}: {plan.token_limit}</div>
                          )}
                          {plan.multi_user_limit && (
                            <div>{isRTL ? "مستخدمين" : "Users"}: {plan.multi_user_limit}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {plan.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {isRTL ? "نشط" : "Active"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            {isRTL ? "غير نشط" : "Inactive"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Plan Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isRTL ? "إضافة خطة جديدة" : "Add New Plan"}
                  </h2>
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "اسم الخطة" : "Plan Name"} *
                      </label>
                      <input
                        type="text"
                        value={planFormData.plan_name}
                        onChange={(e) => setPlanFormData({ ...planFormData, plan_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder={isRTL ? "اسم الخطة" : "Plan name"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "نوع الخطة" : "Plan Type"} *
                      </label>
                      <select
                        value={planFormData.plan_type}
                        onChange={(e) => setPlanFormData({ ...planFormData, plan_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="free">{isRTL ? "مجاني" : "Free"}</option>
                        <option value="monthly">{isRTL ? "شهري" : "Monthly"}</option>
                        <option value="annual">{isRTL ? "سنوي" : "Annual"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "السعر" : "Price"} *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={planFormData.price}
                        onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "دورة الفوترة" : "Billing Cycle"} *
                      </label>
                      <select
                        value={planFormData.billing_cycle}
                        onChange={(e) => setPlanFormData({ ...planFormData, billing_cycle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="none">{isRTL ? "لا شيء" : "None"}</option>
                        <option value="monthly">{isRTL ? "شهري" : "Monthly"}</option>
                        <option value="yearly">{isRTL ? "سنوي" : "Yearly"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "حد الملفات" : "File Limit"}
                      </label>
                      <input
                        type="number"
                        value={planFormData.file_limit}
                        onChange={(e) => setPlanFormData({ ...planFormData, file_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="-"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "حد رسائل AI" : "AI Messages Limit"}
                      </label>
                      <input
                        type="number"
                        value={planFormData.ai_message_limit}
                        onChange={(e) => setPlanFormData({ ...planFormData, ai_message_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="-"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "حد العقود" : "Contract Limit"}
                      </label>
                      <input
                        type="number"
                        value={planFormData.contract_limit}
                        onChange={(e) => setPlanFormData({ ...planFormData, contract_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="-"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "حد التقارير" : "Report Limit"}
                      </label>
                      <input
                        type="number"
                        value={planFormData.report_limit}
                        onChange={(e) => setPlanFormData({ ...planFormData, report_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="-"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "حد التوكنات" : "Token Limit"}
                      </label>
                      <input
                        type="number"
                        value={planFormData.token_limit}
                        onChange={(e) => setPlanFormData({ ...planFormData, token_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="-"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRTL ? "حد المستخدمين" : "Multi-User Limit"}
                      </label>
                      <input
                        type="number"
                        value={planFormData.multi_user_limit}
                        onChange={(e) => setPlanFormData({ ...planFormData, multi_user_limit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="-"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "الوصف" : "Description"}
                    </label>
                    <textarea
                      value={planFormData.description}
                      onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={isRTL ? "وصف الخطة" : "Plan description"}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={planFormData.is_active}
                      onChange={(e) => setPlanFormData({ ...planFormData, is_active: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      {isRTL ? "الخطة نشطة" : "Plan is active"}
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowPlanModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      {isRTL ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      onClick={handleCreatePlan}
                      disabled={!planFormData.plan_name || createPlanMutation.isPending}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createPlanMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 inline animate-spin mr-2" />
                          {isRTL ? "جاري الإنشاء..." : "Creating..."}
                        </>
                      ) : (
                        isRTL ? "إنشاء" : "Create"
                      )}
                    </button>
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

