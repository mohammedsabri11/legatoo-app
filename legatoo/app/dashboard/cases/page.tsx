"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function CasesPage() {
  const {  locale } = useTranslation();
  const isRTL = locale === 'ar';

  // Mock data - replace with real data from your API
  const cases = [
    {
      id: 1,
      title: "Contract Dispute - ABC Corp",
      status: "active",
      priority: "high",
      client: "ABC Corporation",
      assignedTo: "John Smith",
      createdAt: "2024-01-15",
      dueDate: "2024-02-15",
      documents: 12,
      progress: 75
    },
    {
      id: 2,
      title: "Employment Law Case",
      status: "pending",
      priority: "medium",
      client: "XYZ Ltd",
      assignedTo: "Sarah Johnson",
      createdAt: "2024-01-20",
      dueDate: "2024-03-01",
      documents: 8,
      progress: 45
    },
    {
      id: 3,
      title: "Intellectual Property Dispute",
      status: "completed",
      priority: "low",
      client: "Tech Innovations Inc",
      assignedTo: "Mike Davis",
      createdAt: "2024-01-10",
      dueDate: "2024-01-30",
      documents: 15,
      progress: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'إدارة القضايا' : 'Case Management'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'إدارة وتتبع جميع القضايا القانونية' : 'Manage and track all legal cases'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إضافة قضية جديدة' : 'Add New Case'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'إجمالي القضايا' : 'Total Cases'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">24</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'قضايا نشطة' : 'Active Cases'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'قضايا معلقة' : 'Pending Cases'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">8</dd>
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
                      {isRTL ? 'قضايا مكتملة' : 'Completed Cases'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">4</dd>
                  </dl>
                </div>
              </div>
            </div>
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
                  placeholder={isRTL ? "البحث في القضايا..." : "Search cases..."}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} border !border-primary rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center px-3 py-2 border !border-primary shadow-sm text-sm leading-4 font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تصفية' : 'Filter'}
              </button>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isRTL ? 'القضايا الحديثة' : 'Recent Cases'}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'القضية' : 'Case'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'العميل' : 'Client'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الأولوية' : 'Priority'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'التقدم' : 'Progress'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className={`ml-4 ${isRTL ? 'mr-4 ml-0 text-right' : 'text-left'}`}>
                            <div className="text-sm font-medium text-gray-900">
                              {caseItem.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {caseItem.documents} {isRTL ? 'وثيقة' : 'documents'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{caseItem.client}</div>
                        <div className="text-sm text-gray-500">{caseItem.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                          {getStatusIcon(caseItem.status)}
                          <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>
                            {caseItem.status === 'active' ? (isRTL ? 'نشط' : 'Active') :
                             caseItem.status === 'pending' ? (isRTL ? 'معلق' : 'Pending') :
                             caseItem.status === 'completed' ? (isRTL ? 'مكتمل' : 'Completed') : caseItem.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority === 'high' ? (isRTL ? 'عالي' : 'High') :
                           caseItem.priority === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                           caseItem.priority === 'low' ? (isRTL ? 'منخفض' : 'Low') : caseItem.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${caseItem.progress}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm text-gray-500 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                            {caseItem.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

