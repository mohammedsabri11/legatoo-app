"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  TrendingUp, 
  TrendingDown,
 
  Download,
  RefreshCw,
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Users,
  Shield,
  Clock
} from "lucide-react";

export default function ComplianceScorePage() {
  const {  locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock data - replace with real data from your API
  const complianceScore = {
    current: 87,
    previous: 82,
    target: 95,
    trend: 'up',
    change: 5
  };

  const scoreBreakdown = [
    {
      category: "Data Protection (GDPR)",
      score: 92,
      weight: 25,
      status: "excellent",
      lastReview: "2024-01-15",
      violations: 0
    },
    {
      category: "Employment Law",
      score: 85,
      weight: 20,
      status: "good",
      lastReview: "2024-01-10",
      violations: 1
    },
    {
      category: "Financial Regulations",
      score: 78,
      weight: 20,
      status: "needs_improvement",
      lastReview: "2024-01-05",
      violations: 2
    },
    {
      category: "Health & Safety",
      score: 95,
      weight: 15,
      status: "excellent",
      lastReview: "2024-01-20",
      violations: 0
    },
    {
      category: "Environmental",
      score: 65,
      weight: 10,
      status: "poor",
      lastReview: "2023-12-15",
      violations: 3
    },
    {
      category: "Industry Standards",
      score: 88,
      weight: 10,
      status: "good",
      lastReview: "2024-01-12",
      violations: 1
    }
  ];

  const monthlyTrends = [
    { month: "Jan 2023", score: 75 },
    { month: "Feb 2023", score: 78 },
    { month: "Mar 2023", score: 82 },
    { month: "Apr 2023", score: 79 },
    { month: "May 2023", score: 85 },
    { month: "Jun 2023", score: 88 },
    { month: "Jul 2023", score: 86 },
    { month: "Aug 2023", score: 89 },
    { month: "Sep 2023", score: 91 },
    { month: "Oct 2023", score: 88 },
    { month: "Nov 2023", score: 85 },
    { month: "Dec 2023", score: 82 },
    { month: "Jan 2024", score: 87 }
  ];

  const departmentScores = [
    {
      department: "Legal",
      score: 94,
      employees: 12,
      complianceRate: 98,
      lastAudit: "2024-01-15"
    },
    {
      department: "HR",
      score: 89,
      employees: 8,
      complianceRate: 95,
      lastAudit: "2024-01-10"
    },
    {
      department: "Finance",
      score: 76,
      employees: 15,
      complianceRate: 88,
      lastAudit: "2024-01-05"
    },
    {
      department: "IT",
      score: 91,
      employees: 20,
      complianceRate: 96,
      lastAudit: "2024-01-12"
    },
    {
      department: "Operations",
      score: 83,
      employees: 25,
      complianceRate: 92,
      lastAudit: "2024-01-08"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'needs_improvement':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4" />;
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'needs_improvement':
        return <AlertTriangle className="h-4 w-4" />;
      case 'poor':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 80) return 'bg-blue-600';
    if (score >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لوحة درجات الامتثال' : 'Compliance Score Dashboard'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'مراقبة وتحليل درجات الامتثال التنظيمي' : 'Monitor and analyze regulatory compliance scores'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
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
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تحديث' : 'Refresh'}
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تصدير' : 'Export'}
            </button>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {isRTL ? 'درجة الامتثال الإجمالية' : 'Overall Compliance Score'}
              </h2>
              <p className="text-sm text-gray-500">
                {isRTL ? 'بناءً على جميع المعايير واللوائح' : 'Based on all standards and regulations'}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${getScoreColor(complianceScore.current)}`}>
                {complianceScore.current}%
              </div>
              <div className="flex items-center justify-end text-sm text-gray-500">
                {complianceScore.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                {complianceScore.trend === 'up' ? '+' : '-'}
                {Math.abs(complianceScore.change)}% 
                {isRTL ? 'من الشهر الماضي' : 'from last month'}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{isRTL ? 'الهدف:' : 'Target:'} {complianceScore.target}%</span>
              <span>{complianceScore.current}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${getScoreBgColor(complianceScore.current)}`}
                style={{ width: `${(complianceScore.current / complianceScore.target) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'تفصيل الدرجات حسب الفئة' : 'Score Breakdown by Category'}
          </h3>
          <div className="space-y-4">
            {scoreBreakdown.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <h4 className={`text-sm font-medium ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>
                      {item.category}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                      {item.score}%
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === 'excellent' ? (isRTL ? 'ممتاز' : 'Excellent') :
                       item.status === 'good' ? (isRTL ? 'جيد' : 'Good') :
                       item.status === 'needs_improvement' ? (isRTL ? 'يحتاج تحسين' : 'Needs Improvement') :
                       item.status === 'poor' ? (isRTL ? 'ضعيف' : 'Poor') : item.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${getScoreBgColor(item.score)}`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.weight}% {isRTL ? 'وزن' : 'weight'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.violations} {isRTL ? 'انتهاك' : 'violations'} • 
                    {isRTL ? 'آخر مراجعة:' : 'Last review:'} {new Date(item.lastReview).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'اتجاهات الدرجات الشهرية' : 'Monthly Score Trends'}
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyTrends.map((trend, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t ${getScoreBgColor(trend.score)}`}
                  style={{ height: `${(trend.score / 100) * 200}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                  {trend.month.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Department Scores */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'درجات الأقسام' : 'Department Scores'}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'القسم' : 'Department'}
                  </th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'الدرجة' : 'Score'}
                  </th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'الموظفين' : 'Employees'}
                  </th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'معدل الامتثال' : 'Compliance Rate'}
                  </th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'آخر تدقيق' : 'Last Audit'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentScores.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                          <div className="text-sm font-medium text-gray-900">
                            {dept.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${getScoreBgColor(dept.score)}`}
                            style={{ width: `${dept.score}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(dept.score)}`}>
                          {dept.score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.employees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.complianceRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(dept.lastAudit).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'الهدف' : 'Target'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{complianceScore.target}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'التحسن' : 'Improvement'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">+{complianceScore.change}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'الفئات المتوافقة' : 'Compliant Categories'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {scoreBreakdown.filter(item => item.status === 'excellent' || item.status === 'good').length}
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
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'المراجعات المطلوبة' : 'Reviews Required'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {scoreBreakdown.filter(item => item.status === 'needs_improvement' || item.status === 'poor').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




