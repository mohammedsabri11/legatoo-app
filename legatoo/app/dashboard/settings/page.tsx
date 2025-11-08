"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Settings, 
  Save, 
  RefreshCw,
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  Users,
  Mail,
  Smartphone,
  Monitor,
  Wifi,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

export default function SettingsPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    theme: 'light',
    autoSave: true,
    notifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    apiAccess: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      enabled: true,
      caseUpdates: true,
      contractDeadlines: true,
      systemAlerts: true,
      weeklyReports: false
    },
    push: {
      enabled: true,
      caseUpdates: true,
      contractDeadlines: true,
      systemAlerts: true
    },
    sms: {
      enabled: false,
      urgentAlerts: true,
      securityAlerts: true
    }
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    apiKey: "sk-1234567890abcdef",
    webhookUrl: "https://api.legatoo.com/webhooks",
    rateLimit: 1000,
    allowedOrigins: ["https://app.legatoo.com", "https://admin.legatoo.com"],
    autoSync: true,
    syncInterval: 15
  });

  const tabs = [
    { id: 'general', name: isRTL ? 'عام' : 'General', icon: Settings },
    { id: 'security', name: isRTL ? 'الأمان' : 'Security', icon: Shield },
    { id: 'notifications', name: isRTL ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: 'integrations', name: isRTL ? 'التكاملات' : 'Integrations', icon: Database },
    { id: 'team', name: isRTL ? 'الفريق' : 'Team', icon: Users }
  ];

  const handleGeneralChange = (field: string, value: string | boolean) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field: string, value: string | boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: string, field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleIntegrationChange = (field: string, value: string | boolean | number) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save the settings to your API
    console.log('Saving settings:', {
      general: generalSettings,
      security: securitySettings,
      notifications: notificationSettings,
      integrations: integrationSettings
    });
  };

  const generateNewApiKey = () => {
    const newKey = "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setIntegrationSettings(prev => ({
      ...prev,
      apiKey: newKey
    }));
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'إعدادات الحساب' : 'Account Settings'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'إدارة إعدادات حسابك وتفضيلات النظام' : 'Manage your account settings and system preferences'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isRTL ? 'الإعدادات العامة' : 'General Settings'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'اللغة' : 'Language'}
                      </label>
                      <select
                        value={generalSettings.language}
                        onChange={(e) => handleGeneralChange('language', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'المنطقة الزمنية' : 'Timezone'}
                      </label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="UTC-5">UTC-5 (EST)</option>
                        <option value="UTC-8">UTC-8 (PST)</option>
                        <option value="UTC+0">UTC+0 (GMT)</option>
                        <option value="UTC+3">UTC+3 (AST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'تنسيق التاريخ' : 'Date Format'}
                      </label>
                      <select
                        value={generalSettings.dateFormat}
                        onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'العملة' : 'Currency'}
                      </label>
                      <select
                        value={generalSettings.currency}
                        onChange={(e) => handleGeneralChange('currency', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="SAR">SAR (ر.س)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'المظهر' : 'Theme'}
                      </label>
                      <select
                        value={generalSettings.theme}
                        onChange={(e) => handleGeneralChange('theme', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="light">{isRTL ? 'فاتح' : 'Light'}</option>
                        <option value="dark">{isRTL ? 'داكن' : 'Dark'}</option>
                        <option value="auto">{isRTL ? 'تلقائي' : 'Auto'}</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {isRTL ? 'الحفظ التلقائي' : 'Auto Save'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {isRTL ? 'حفظ التغييرات تلقائياً أثناء العمل' : 'Automatically save changes while working'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleGeneralChange('autoSave', !generalSettings.autoSave)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          generalSettings.autoSave ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            generalSettings.autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {isRTL ? 'الإشعارات العامة' : 'General Notifications'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {isRTL ? 'تلقي الإشعارات العامة من النظام' : 'Receive general notifications from the system'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleGeneralChange('notifications', !generalSettings.notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          generalSettings.notifications ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            generalSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isRTL ? 'إعدادات الأمان' : 'Security Settings'}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {isRTL ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {isRTL ? 'إضافة طبقة إضافية من الأمان لحسابك' : 'Add an extra layer of security to your account'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securitySettings.twoFactorAuth ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? 'مهلة انتهاء الجلسة (دقيقة)' : 'Session Timeout (minutes)'}
                        </label>
                        <input
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? 'انتهاء صلاحية كلمة المرور (يوم)' : 'Password Expiry (days)'}
                        </label>
                        <input
                          type="number"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {isRTL ? 'إشعارات تسجيل الدخول' : 'Login Notifications'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {isRTL ? 'تلقي إشعارات عند تسجيل الدخول من أجهزة جديدة' : 'Receive notifications when logging in from new devices'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSecurityChange('loginNotifications', !securitySettings.loginNotifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            securitySettings.loginNotifications ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              securitySettings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {isRTL ? 'تنبيهات النشاط المشبوه' : 'Suspicious Activity Alerts'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {isRTL ? 'تلقي تنبيهات عند اكتشاف نشاط مشبوه' : 'Receive alerts when suspicious activity is detected'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSecurityChange('suspiciousActivityAlerts', !securitySettings.suspiciousActivityAlerts)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            securitySettings.suspiciousActivityAlerts ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              securitySettings.suspiciousActivityAlerts ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {isRTL ? 'الوصول إلى API' : 'API Access'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {isRTL ? 'السماح بالوصول إلى API للتطبيقات الخارجية' : 'Allow API access for external applications'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSecurityChange('apiAccess', !securitySettings.apiAccess)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            securitySettings.apiAccess ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              securitySettings.apiAccess ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isRTL ? 'إعدادات الإشعارات' : 'Notification Settings'}
                  </h3>
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                          <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
                        </h4>
                        <button
                          onClick={() => handleNotificationChange('email', 'enabled', !notificationSettings.email.enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationSettings.email.enabled ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationSettings.email.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="space-y-3 ml-6">
                        {Object.entries(notificationSettings.email).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                              {key === 'caseUpdates' ? (isRTL ? 'تحديثات القضايا' : 'Case Updates') :
                               key === 'contractDeadlines' ? (isRTL ? 'مواعيد العقود' : 'Contract Deadlines') :
                               key === 'systemAlerts' ? (isRTL ? 'تنبيهات النظام' : 'System Alerts') :
                               key === 'weeklyReports' ? (isRTL ? 'التقارير الأسبوعية' : 'Weekly Reports') : key}
                            </span>
                            <button
                              onClick={() => handleNotificationChange('email', key, !value)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                value ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  value ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                          <Smartphone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {isRTL ? 'الإشعارات الفورية' : 'Push Notifications'}
                        </h4>
                        <button
                          onClick={() => handleNotificationChange('push', 'enabled', !notificationSettings.push.enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationSettings.push.enabled ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationSettings.push.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="space-y-3 ml-6">
                        {Object.entries(notificationSettings.push).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                              {key === 'caseUpdates' ? (isRTL ? 'تحديثات القضايا' : 'Case Updates') :
                               key === 'contractDeadlines' ? (isRTL ? 'مواعيد العقود' : 'Contract Deadlines') :
                               key === 'systemAlerts' ? (isRTL ? 'تنبيهات النظام' : 'System Alerts') : key}
                            </span>
                            <button
                              onClick={() => handleNotificationChange('push', key, !value)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                value ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  value ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SMS Notifications */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                          <Smartphone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {isRTL ? 'إشعارات الرسائل النصية' : 'SMS Notifications'}
                        </h4>
                        <button
                          onClick={() => handleNotificationChange('sms', 'enabled', !notificationSettings.sms.enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationSettings.sms.enabled ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationSettings.sms.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="space-y-3 ml-6">
                        {Object.entries(notificationSettings.sms).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                              {key === 'urgentAlerts' ? (isRTL ? 'التنبيهات العاجلة' : 'Urgent Alerts') :
                               key === 'securityAlerts' ? (isRTL ? 'تنبيهات الأمان' : 'Security Alerts') : key}
                            </span>
                            <button
                              onClick={() => handleNotificationChange('sms', key, !value)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                value ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  value ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isRTL ? 'إعدادات التكامل' : 'Integration Settings'}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'مفتاح API' : 'API Key'}
                      </label>
                      <div className="flex">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={integrationSettings.apiKey}
                          readOnly
                          className="block w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm bg-gray-50"
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={generateNewApiKey}
                          className="ml-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {isRTL ? 'استخدم هذا المفتاح للوصول إلى API من التطبيقات الخارجية' : 'Use this key to access the API from external applications'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'رابط Webhook' : 'Webhook URL'}
                      </label>
                      <input
                        type="url"
                        value={integrationSettings.webhookUrl}
                        onChange={(e) => handleIntegrationChange('webhookUrl', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? 'حد المعدل (طلبات/ساعة)' : 'Rate Limit (requests/hour)'}
                        </label>
                        <input
                          type="number"
                          value={integrationSettings.rateLimit}
                          onChange={(e) => handleIntegrationChange('rateLimit', parseInt(e.target.value))}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isRTL ? 'فترة المزامنة (دقيقة)' : 'Sync Interval (minutes)'}
                        </label>
                        <input
                          type="number"
                          value={integrationSettings.syncInterval}
                          onChange={(e) => handleIntegrationChange('syncInterval', parseInt(e.target.value))}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'الأصول المسموحة' : 'Allowed Origins'}
                      </label>
                      <textarea
                        value={integrationSettings.allowedOrigins.join('\n')}
                        // onChange={(e) => handleIntegrationChange('allowedOrigins', e.target.value.split('\n'))}
                        rows={3}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="https://app.example.com&#10;https://admin.example.com"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {isRTL ? 'المزامنة التلقائية' : 'Auto Sync'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {isRTL ? 'مزامنة البيانات تلقائياً مع الأنظمة الخارجية' : 'Automatically sync data with external systems'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleIntegrationChange('autoSync', !integrationSettings.autoSync)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          integrationSettings.autoSync ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            integrationSettings.autoSync ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Settings */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isRTL ? 'إعدادات الفريق' : 'Team Settings'}
                  </h3>
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {isRTL ? 'إعدادات الفريق' : 'Team Settings'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isRTL ? 'إدارة أعضاء الفريق والأذونات' : 'Manage team members and permissions'}
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <Users className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'إدارة الفريق' : 'Manage Team'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}










