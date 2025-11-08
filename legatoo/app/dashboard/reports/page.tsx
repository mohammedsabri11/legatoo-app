"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  BarChart3, 
  Download, 
  Calendar,
  Filter,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Share,
  RefreshCw,
  Search
} from "lucide-react";

export default function ReportsPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [selectedReport, setSelectedReport] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock data - replace with real data from your API
  const reports = [
    {
      id: 1,
      title: "Monthly Compliance Report",
      type: "Compliance",
      status: "completed",
      generatedAt: "2024-01-20",
      period: "January 2024",
      size: "2.3 MB",
      format: "PDF",
      downloads: 15,
      description: "Comprehensive compliance analysis for January 2024"
    },
    {
      id: 2,
      title: "Contract Performance Analysis",
      type: "Contracts",
      status: "completed",
      generatedAt: "2024-01-18",
      period: "Q4 2023",
      size: "1.8 MB",
      format: "Excel",
      downloads: 8,
      description: "Quarterly contract performance and renewal analysis"
    },
    {
      id: 3,
      title: "Risk Assessment Summary",
      type: "Risk",
      status: "generating",
      generatedAt: "2024-01-19",
      period: "January 2024",
      size: "N/A",
      format: "PDF",
      downloads: 0,
      description: "Monthly risk assessment and mitigation strategies"
    },
    {
      id: 4,
      title: "Legal Case Statistics",
      type: "Cases",
      status: "completed",
      generatedAt: "2024-01-15",
      period: "January 2024",
      size: "3.1 MB",
      format: "PDF",
      downloads: 12,
      description: "Case management statistics and outcomes analysis"
    },
    {
      id: 5,
      title: "Financial Compliance Audit",
      type: "Financial",
      status: "scheduled",
      generatedAt: "2024-01-25",
      period: "January 2024",
      size: "N/A",
      format: "PDF",
      downloads: 0,
      description: "Monthly financial compliance and audit report"
    }
  ];

  const reportTypes = [
    { id: 'all', name: isRTL ? 'الكل' : 'All', count: reports.length },
    { id: 'Compliance', name: isRTL ? 'الامتثال' : 'Compliance', count: reports.filter(r => r.type === 'Compliance').length },
    { id: 'Contracts', name: isRTL ? 'العقود' : 'Contracts', count: reports.filter(r => r.type === 'Contracts').length },
    { id: 'Risk', name: isRTL ? 'المخاطر' : 'Risk', count: reports.filter(r => r.type === 'Risk').length },
    { id: 'Cases', name: isRTL ? 'القضايا' : 'Cases', count: reports.filter(r => r.type === 'Cases').length },
    { id: 'Financial', name: isRTL ? 'المالية' : 'Financial', count: reports.filter(r => r.type === 'Financial').length }
  ];

  const quickStats = [
    {
      title: "Total Reports Generated",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: FileText
    },
    {
      title: "Active Downloads",
      value: "2,847",
      change: "+8%",
      trend: "up",
      icon: Download
    },
    {
      title: "Average Report Size",
      value: "2.1 MB",
      change: "-3%",
      trend: "down",
      icon: BarChart3
    },
    {
      title: "Generation Time",
      value: "4.2 min",
      change: "-15%",
      trend: "down",
      icon: Clock
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Compliance':
        return 'bg-green-100 text-green-800';
      case 'Contracts':
        return 'bg-blue-100 text-blue-800';
      case 'Risk':
        return 'bg-red-100 text-red-800';
      case 'Cases':
        return 'bg-purple-100 text-purple-800';
      case 'Financial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'generating':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const filteredReports = selectedReport === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedReport);

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'التقارير والأداء' : 'Performance Reports'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'إنشاء وإدارة التقارير التحليلية والأداء' : 'Generate and manage analytical and performance reports'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Calendar className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'جدولة تقرير' : 'Schedule Report'}
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <BarChart3 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إنشاء تقرير جديد' : 'Generate New Report'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                      <dd className="flex items-center text-sm">
                        {getTrendIcon(stat.trend)}
                        <span className={`ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Type Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isRTL ? 'نوع التقرير' : 'Report Type'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedReport === type.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedReport === type.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {type.count}
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
                  placeholder={isRTL ? "البحث في التقارير..." : "Search reports..."}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <option value="7d">{isRTL ? 'آخر 7 أيام' : 'Last 7 days'}</option>
                <option value="30d">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</option>
                <option value="90d">{isRTL ? 'آخر 90 يوم' : 'Last 90 days'}</option>
                <option value="1y">{isRTL ? 'آخر سنة' : 'Last year'}</option>
              </select>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تصفية' : 'Filter'}
              </button>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isRTL ? 'التقارير الحديثة' : 'Recent Reports'}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'التقرير' : 'Report'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'النوع' : 'Type'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الفترة' : 'Period'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الحجم' : 'Size'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'التحميلات' : 'Downloads'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className={`ml-4 ${isRTL ? 'mr-4 ml-0 text-right' : 'text-left'}`}>
                            <div className="text-sm font-medium text-gray-900">
                              {report.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {report.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className={`${isRTL ? 'mr-1' : 'ml-1'}`}>
                            {report.status === 'completed' ? (isRTL ? 'مكتمل' : 'Completed') :
                             report.status === 'generating' ? (isRTL ? 'قيد الإنشاء' : 'Generating') :
                             report.status === 'scheduled' ? (isRTL ? 'مجدول' : 'Scheduled') :
                             report.status === 'failed' ? (isRTL ? 'فشل' : 'Failed') : report.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.size} • {report.format}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.downloads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {report.status === 'completed' && (
                            <>
                              <button className="text-primary hover:text-primary/80">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Share className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {report.status === 'generating' && (
                            <button className="text-gray-400 cursor-not-allowed">
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            </button>
                          )}
                          {report.status === 'scheduled' && (
                            <button className="text-gray-400 hover:text-gray-600">
                              <Calendar className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Report Generation Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'حالة إنشاء التقارير' : 'Report Generation Status'}
          </h3>
          <div className="space-y-3">
            {reports
              .filter(report => report.status === 'generating' || report.status === 'scheduled')
              .map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        {getStatusIcon(report.status)}
                      </div>
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {report.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.type} • {report.period} • {new Date(report.generatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status === 'generating' ? (isRTL ? 'قيد الإنشاء' : 'Generating') :
                     report.status === 'scheduled' ? (isRTL ? 'مجدول' : 'Scheduled') : report.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Popular Reports */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'التقارير الأكثر شعبية' : 'Most Popular Reports'}
          </h3>
          <div className="space-y-3">
            {reports
              .filter(report => report.status === 'completed')
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 5)
              .map((report, index) => (
                <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {report.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.downloads} {isRTL ? 'تحميل' : 'downloads'} • {report.size} • {report.format}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                    {report.type}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}










