"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useProfileManagement } from "@/hooks/useProfile";
import {
  Calendar,
  Edit3,
  Save,
  Camera,
  Shield,
  Globe,
  Eye,
  EyeOff,
  Loader2,
  Check,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";

  const {
    // State
    isEditing,
    setIsEditing,
    showPassword,
    setShowPassword,
    activeTab,
    setActiveTab,

    // Data
    profile,
    isLoading,
    error,
    formData,
    passwordData,
    notifications,
    privacy,

    // Handlers
    handleInputChange,
    handlePasswordChange,
    handleNotificationChange,
    handlePrivacyChange,
    handleSaveProfile,
    handleSavePassword,
    handleSaveNotifications,
    handleSavePrivacy,

    // Validation
    passwordValidation,

    // Loading states
    isUpdatingProfile,
    isChangingPassword,
    isUpdatingNotifications,
    isUpdatingPrivacy,
  } = useProfileManagement();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <X className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Failed to load profile data</p>
            <p className="text-sm text-gray-500 mt-1">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              {isRTL ? "الملف الشخصي" : "Profile"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL
                ? "إدارة معلوماتك الشخصية وإعدادات الحساب"
                : "Manage your personal information and account settings"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Edit3 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {isRTL ? "تعديل الملف الشخصي" : "Edit Profile"}
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isUpdatingProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isUpdatingProfile ? (
                    <Loader2
                      className={`h-4 w-4 animate-spin ${
                        isRTL ? "ml-2" : "mr-2"
                      }`}
                    />
                  ) : (
                    <Save className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  )}
                  {isRTL ? "حفظ" : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b pb-1 border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              {
                id: "profile",
                label: isRTL ? "الملف الشخصي" : "Profile",
                icon: Camera,
              },
              {
                id: "password",
                label: isRTL ? "كلمة المرور" : "Password",
                icon: Shield,
              },
              {
                id: "notifications",
                label: isRTL ? "الإشعارات" : "Notifications",
                icon: Globe,
              },
              {
                id: "privacy",
                label: isRTL ? "الخصوصية" : "Privacy",
                icon: Eye,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as
                        | "profile"
                        | "password"
                        | "notifications"
                        | "privacy"
                    )
                  }
                  className={`py-2 px-3   font-medium text-sm ${
                    activeTab === tab.id
                      ? " bg-primary text-white border-primary rounded-md"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 inline ${isRTL ? "ml-2" : "mr-2"}`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "profile" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isRTL ? "المعلومات الأساسية" : "Basic Information"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "الاسم الأول" : "First Name"}
                    </label>
                    <input
                      type="text"
                      value={formData.first_name || ""}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "الاسم الأخير" : "Last Name"}
                    </label>
                    <input
                      type="text"
                      value={formData.last_name || ""}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_number || ""}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder={isRTL ? "05 1234 5678" : "05 1234 5678"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {isEditing && (
                      <p className="mt-1 text-xs text-gray-500">
                        {isRTL 
                          ? "يجب أن يكون 10 أرقام تبدأ بـ 05" 
                          : "Must be 10 digits starting with 05"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "الموقع" : "Location"}
                    </label>
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isRTL ? "تغيير كلمة المرور" : "Change Password"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "كلمة المرور الحالية" : "Current Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={(e) =>
                          handlePasswordChange(
                            "current_password",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "كلمة المرور الجديدة" : "New Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.new_password}
                        onChange={(e) =>
                          handlePasswordChange("new_password", e.target.value)
                        }
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Password validation */}
                    {passwordData.new_password && (
                      <div className="mt-2 space-y-1">
                        <div
                          className={`flex items-center text-xs ${
                            passwordValidation.minLength
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {isRTL ? "8 أحرف على الأقل" : "At least 8 characters"}
                        </div>
                        <div
                          className={`flex items-center text-xs ${
                            passwordValidation.hasUpperCase
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {isRTL ? "حرف كبير" : "Uppercase letter"}
                        </div>
                        <div
                          className={`flex items-center text-xs ${
                            passwordValidation.hasLowerCase
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {isRTL ? "حرف صغير" : "Lowercase letter"}
                        </div>
                        <div
                          className={`flex items-center text-xs ${
                            passwordValidation.hasNumbers
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {isRTL ? "رقم" : "Number"}
                        </div>
                        <div
                          className={`flex items-center text-xs ${
                            passwordValidation.hasSpecialChar
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {isRTL ? "رمز خاص" : "Special character"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        handlePasswordChange("confirm_password", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    {passwordData.confirm_password &&
                      passwordData.new_password !==
                        passwordData.confirm_password && (
                        <p className="mt-1 text-sm text-red-600">
                          {isRTL
                            ? "كلمات المرور غير متطابقة"
                            : "Passwords do not match"}
                        </p>
                      )}
                  </div>

                  <button
                    onClick={handleSavePassword}
                    disabled={
                      isChangingPassword ||
                      !passwordValidation.isValid ||
                      passwordData.new_password !==
                        passwordData.confirm_password
                    }
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isRTL ? "حفظ كلمة المرور" : "Save Password"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isRTL ? "إعدادات الإشعارات" : "Notification Settings"}
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      key: "email_notifications",
                      label: isRTL
                        ? "إشعارات البريد الإلكتروني"
                        : "Email Notifications",
                    },
                    {
                      key: "push_notifications",
                      label: isRTL ? "الإشعارات الفورية" : "Push Notifications",
                    },
                    {
                      key: "sms_notifications",
                      label: isRTL
                        ? "إشعارات الرسائل النصية"
                        : "SMS Notifications",
                    },
                    {
                      key: "weekly_reports",
                      label: isRTL ? "التقارير الأسبوعية" : "Weekly Reports",
                    },
                    {
                      key: "security_alerts",
                      label: isRTL ? "تنبيهات الأمان" : "Security Alerts",
                    },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {setting.label}
                      </span>
                      <button
                        onClick={() =>
                          handleNotificationChange(
                            setting.key as keyof typeof notifications,
                            !notifications[
                              setting.key as keyof typeof notifications
                            ]
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          notifications[
                            setting.key as keyof typeof notifications
                          ]
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[
                              setting.key as keyof typeof notifications
                            ]
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleSaveNotifications}
                    disabled={isUpdatingNotifications}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {isUpdatingNotifications ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isRTL ? "حفظ الإعدادات" : "Save Settings"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isRTL ? "إعدادات الخصوصية" : "Privacy Settings"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isRTL ? "رؤية الملف الشخصي" : "Profile Visibility"}
                    </label>
                    <select
                      value={privacy.profile_visibility}
                      onChange={(e) =>
                        handlePrivacyChange(
                          "profile_visibility",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="public">{isRTL ? "عام" : "Public"}</option>
                      <option value="team">{isRTL ? "الفريق" : "Team"}</option>
                      <option value="private">
                        {isRTL ? "خاص" : "Private"}
                      </option>
                    </select>
                  </div>

                  {[
                    {
                      key: "show_email",
                      label: isRTL ? "إظهار البريد الإلكتروني" : "Show Email",
                    },
                    {
                      key: "show_phone",
                      label: isRTL ? "إظهار رقم الهاتف" : "Show Phone",
                    },
                    {
                      key: "show_location",
                      label: isRTL ? "إظهار الموقع" : "Show Location",
                    },
                    {
                      key: "allow_direct_messages",
                      label: isRTL
                        ? "السماح بالرسائل المباشرة"
                        : "Allow Direct Messages",
                    },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {setting.label}
                      </span>
                      <button
                        onClick={() =>
                          handlePrivacyChange(
                            setting.key as keyof typeof privacy,
                            !privacy[setting.key as keyof typeof privacy]
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          privacy[setting.key as keyof typeof privacy]
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacy[setting.key as keyof typeof privacy]
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleSavePrivacy}
                    disabled={isUpdatingPrivacy}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {isUpdatingPrivacy ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isRTL ? "حفظ الإعدادات" : "Save Settings"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {profile?.first_name?.[0] || "U"}
                    {profile?.last_name?.[0] || ""}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                  <p className="text-sm text-gray-500">
                    {profile?.account_type}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isRTL ? "معلومات الحساب" : "Account Information"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {isRTL ? "تاريخ الانضمام:" : "Joined:"}{" "}
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {isRTL ? "آخر تسجيل دخول:" : "Last Login:"}{" "}
                    {profile?.last_login
                      ? new Date(profile.last_login).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
