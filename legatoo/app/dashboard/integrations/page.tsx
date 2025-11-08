"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Plug, 
  Plus, 
  Search, 
  Filter, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
  Eye,
  Download,
  Activity,
  Shield,
  Database,
  Cloud,
  Zap
} from "lucide-react";

export default function IntegrationsPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data - replace with real data from your API
  const integrations = [
    {
      id: 1,
      name: "Microsoft Office 365",
      type: "Productivity",
      status: "active",
      description: "Sync documents and collaborate on legal documents",
      lastSync: "2024-01-20T10:30:00Z",
      syncFrequency: "Real-time",
      apiCalls: 1250,
      dataTransferred: "2.3 GB",
      provider: "Microsoft",
      version: "v2.1.3",
      health: "healthy",
      permissions: ["read", "write", "share"]
    },
    {
      id: 2,
      name: "Salesforce CRM",
      type: "CRM",
      status: "active",
      description: "Manage client relationships and case tracking",
      lastSync: "2024-01-20T09:15:00Z",
      syncFrequency: "Every 15 minutes",
      apiCalls: 890,
      dataTransferred: "1.8 GB",
      provider: "Salesforce",
      version: "v1.8.2",
      health: "healthy",
      permissions: ["read", "write"]
    },
    {
      id: 3,
      name: "DocuSign",
      type: "E-Signature",
      status: "error",
      description: "Electronic signature and document workflow",
      lastSync: "2024-01-19T14:22:00Z",
      syncFrequency: "Real-time",
      apiCalls: 0,
      dataTransferred: "0 MB",
      provider: "DocuSign",
      version: "v3.0.1",
      health: "error",
      permissions: ["read", "write", "sign"]
    },
    {
      id: 4,
      name: "QuickBooks",
      type: "Accounting",
      status: "pending",
      description: "Financial data synchronization and billing",
      lastSync: "N/A",
      syncFrequency: "Daily",
      apiCalls: 0,
      dataTransferred: "0 MB",
      provider: "Intuit",
      version: "v2.5.0",
      health: "pending",
      permissions: ["read"]
    },
    {
      id: 5,
      name: "Google Workspace",
      type: "Productivity",
      status: "active",
      description: "Email, calendar, and document collaboration",
      lastSync: "2024-01-20T11:45:00Z",
      syncFrequency: "Real-time",
      apiCalls: 2100,
      dataTransferred: "4.1 GB",
      provider: "Google",
      version: "v1.9.4",
      health: "healthy",
      permissions: ["read", "write", "share", "admin"]
    }
  ];

  const availableIntegrations = [
    {
      id: 6,
      name: "Slack",
      type: "Communication",
      description: "Team communication and notifications",
      provider: "Slack Technologies",
      category: "Communication",
      rating: 4.8,
      users: "2.5M+"
    },
    {
      id: 7,
      name: "Zoom",
      type: "Video Conferencing",
      description: "Video meetings and webinars",
      provider: "Zoom Video Communications",
      category: "Communication",
      rating: 4.6,
      users: "1.8M+"
    },
    {
      id: 8,
      name: "HubSpot",
      type: "Marketing",
      description: "Marketing automation and lead management",
      provider: "HubSpot",
      category: "Marketing",
      rating: 4.7,
      users: "500K+"
    },
    {
      id: 9,
      name: "Trello",
      type: "Project Management",
      description: "Project tracking and task management",
      provider: "Atlassian",
      category: "Productivity",
      rating: 4.5,
      users: "1.2M+"
    }
  ];

  const statuses = [
    { id: 'all', name: isRTL ? 'الكل' : 'All', count: integrations.length },
    { id: 'active', name: isRTL ? 'نشط' : 'Active', count: integrations.filter(i => i.status === 'active').length },
    { id: 'error', name: isRTL ? 'خطأ' : 'Error', count: integrations.filter(i => i.status === 'error').length },
    { id: 'pending', name: isRTL ? 'معلق' : 'Pending', count: integrations.filter(i => i.status === 'pending').length }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Productivity':
        return 'bg-blue-100 text-blue-800';
      case 'CRM':
        return 'bg-green-100 text-green-800';
      case 'E-Signature':
        return 'bg-purple-100 text-purple-800';
      case 'Accounting':
        return 'bg-orange-100 text-orange-800';
      case 'Communication':
        return 'bg-pink-100 text-pink-800';
      case 'Marketing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Project Management':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const filteredIntegrations = selectedStatus === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.status === selectedStatus);

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'التكاملات' : 'Integrations'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'إدارة التكاملات مع الأنظمة الخارجية والخدمات' : 'Manage integrations with external systems and services'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إضافة تكامل جديد' : 'Add New Integration'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Plug className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'إجمالي التكاملات' : 'Total Integrations'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{integrations.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'التكاملات النشطة' : 'Active Integrations'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {integrations.filter(i => i.status === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'التكاملات المعطلة' : 'Failed Integrations'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {integrations.filter(i => i.status === 'error').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'إجمالي استدعاءات API' : 'Total API Calls'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {integrations.reduce((sum, i) => sum + i.apiCalls, 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isRTL ? 'حالة التكامل' : 'Integration Status'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedStatus === status.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {status.count}
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
                  placeholder={isRTL ? "البحث في التكاملات..." : "Search integrations..."}
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

        {/* Active Integrations */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isRTL ? 'التكاملات النشطة' : 'Active Integrations'}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'التكامل' : 'Integration'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'النوع' : 'Type'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'آخر مزامنة' : 'Last Sync'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'استدعاءات API' : 'API Calls'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIntegrations.map((integration) => (
                    <tr key={integration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Plug className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className={`ml-4 ${isRTL ? 'mr-4 ml-0 text-right' : 'text-left'}`}>
                            <div className="text-sm font-medium text-gray-900">
                              {integration.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {integration.provider} • {integration.version}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(integration.type)}`}>
                          {integration.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {getStatusIcon(integration.status)}
                            <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>
                              {integration.status === 'active' ? (isRTL ? 'نشط' : 'Active') :
                               integration.status === 'error' ? (isRTL ? 'خطأ' : 'Error') :
                               integration.status === 'pending' ? (isRTL ? 'معلق' : 'Pending') : integration.status}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {integration.lastSync === 'N/A' ? 'N/A' : new Date(integration.lastSync).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {integration.apiCalls.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary hover:text-primary/80">
                            <Settings className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
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

        {/* Available Integrations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'التكاملات المتاحة' : 'Available Integrations'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration) => (
              <div key={integration.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Cloud className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                        <h4 className="text-sm font-medium text-gray-900">
                          {integration.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {integration.provider}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {integration.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(integration.category)}`}>
                        {integration.category}
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          ⭐ {integration.rating}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          ({integration.users})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'إضافة' : 'Add Integration'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Health Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'حالة صحة التكاملات' : 'Integration Health Status'}
          </h3>
          <div className="space-y-3">
            {integrations
              .filter(integration => integration.status === 'active')
              .map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Plug className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {integration.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {integration.dataTransferred} {isRTL ? 'منقول' : 'transferred'} • {integration.syncFrequency}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(integration.health)}`}>
                      {integration.health === 'healthy' ? (isRTL ? 'صحي' : 'Healthy') :
                       integration.health === 'error' ? (isRTL ? 'خطأ' : 'Error') :
                       integration.health === 'pending' ? (isRTL ? 'معلق' : 'Pending') : integration.health}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}










