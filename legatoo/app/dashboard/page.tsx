'use client'

import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Scale,
  Shield,
  FileCheck,
  AlertTriangle,
  Circle
} from 'lucide-react'

export default function DashboardPage() {
  const { locale } = useTranslation();
  const isRTL = locale === 'ar';

  // Quick Overview (KPIs) - Key Performance Indicators
  const kpiStats = [
    {
      name: isRTL ? 'إجمالي القضايا' : 'Total Cases',
      value: '47',
      subtitle: isRTL ? 'مفتوحة: 23 | مغلقة: 18 | معلقة: 6' : 'Open: 23 | Closed: 18 | Pending: 6',
      change: '+8.2%',
      changeType: 'positive',
      icon: Scale,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: isRTL ? 'حالة العقود' : 'Contract Status',
      value: '156',
      subtitle: isRTL ? 'موقعة: 89 | مراجعة: 45 | منتهية: 22' : 'Signed: 89 | Review: 45 | Expired: 22',
      change: '+12.5%',
      changeType: 'positive',
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: isRTL ? 'مؤشر الامتثال' : 'Compliance Indicator',
      value: '85%',
      subtitle: isRTL ? 'نقاط الامتثال الإجمالية' : 'Overall Compliance Score',
      change: '+2.1%',
      changeType: 'positive',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'compliant', // green, yellow, red
    },
    {
      name: isRTL ? 'الوثائق المعلقة' : 'Pending Documents',
      value: '23',
      subtitle: isRTL ? 'في انتظار التحليل' : 'Awaiting Analysis',
      change: '-5.3%',
      changeType: 'negative',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  // Additional dashboard stats
  const additionalStats = [
    {
      name: isRTL ? 'العملاء النشطون' : 'Active Clients',
      value: '18',
      change: '+2.02%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: isRTL ? 'المكتمل هذا الشهر' : 'Completed This Month',
      value: '12',
      change: '+12.5%',
      changeType: 'positive',
      icon: CheckCircle,
    },
  ]

  const recentContracts = [
    {
      id: 1,
      title: 'Employment Agreement - Tech Corp',
      client: 'Tech Corp Inc.',
      status: 'In Review',
      date: '2024-01-15',
      amount: '$5,000',
    },
    {
      id: 2,
      title: 'Service Contract - StartupXYZ',
      client: 'StartupXYZ',
      status: 'Draft',
      date: '2024-01-14',
      amount: '$3,500',
    },
    {
      id: 3,
      title: 'Partnership Agreement - Legal Firm',
      client: 'Legal Partners LLC',
      status: 'Completed',
      date: '2024-01-12',
      amount: '$7,200',
    },
    {
      id: 4,
      title: 'NDA - Confidential Project',
      client: 'Confidential Client',
      status: 'In Review',
      date: '2024-01-10',
      amount: '$1,500',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'violation':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Circle className="h-3 w-3 fill-current" />
      case 'warning':
        return <AlertTriangle className="h-3 w-3 fill-current" />
      case 'violation':
        return <AlertCircle className="h-3 w-3 fill-current" />
      default:
        return <Circle className="h-3 w-3 fill-current" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className={isRTL ? '!text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isRTL ? 'مرحباً بعودتك! إليك نظرة عامة على عملياتك القانونية والمؤشرات الرئيسية للأداء.' : 
             "Welcome back! Here's your legal operations overview and key performance indicators."}
          </p>
        </div>

        {/* Quick Overview (KPIs) Section */}
        <div>
          <h2 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? '!text-right' : 'text-left'}`}>
            {isRTL ? 'نظرة سريعة (المؤشرات الرئيسية)' : 'Quick Overview (KPIs)'}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kpiStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className={`bg-white overflow-hidden shadow-md rounded-lg !border-primary ${isRTL ? 'border-r-4' : 'border-l-4'}`}>
                  <div className="p-5">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className={`w-0 flex-1 ${isRTL ? 'mr-4 !text-right' : 'ml-4 text-left'}`}>
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.change}
                            </div>
                          </dd>
                          <dd className="mt-1">
                            <p className="text-xs text-gray-500">
                              {stat.subtitle}
                            </p>
                          </dd>
                          {/* Compliance Status Indicator */}
                          {stat.name === 'Compliance Indicator' && (
                            <dd className="mt-2">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(stat.status || 'compliant')}`}>
                                {getComplianceIcon(stat.status || 'compliant')}
                                <span className="ml-1">
                                  {stat.status === 'compliant' ? (isRTL ? 'متوافق بالكامل' : 'Fully Compliant') : 
                                   stat.status === 'warning' ? (isRTL ? 'يحتاج مراجعة' : 'Needs Review') : 
                                   stat.status === 'violation' ? (isRTL ? 'تم اكتشاف مخالفة' : 'Violation Detected') : 
                                   (isRTL ? 'غير معروف' : 'Unknown')}
                                </span>
                              </div>
                            </dd>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional Stats */}
        <div>
          <h2 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? '!text-right' : 'text-left'}`}>
            {isRTL ? 'مقاييس إضافية' : 'Additional Metrics'}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {additionalStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className={`w-0 flex-1 ${isRTL ? 'mr-5 !text-right' : 'ml-5 text-left'}`}>
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Contracts */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Contracts
                  </h3>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    View all
                  </button>
                </div>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentContracts.map((contract) => (
                      <li key={contract.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {contract.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {contract.client}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                              {contract.status}
                            </span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {contract.amount}
                              </p>
                              <p className="text-sm text-gray-500">
                                {contract.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
                    <FileText className="h-4 w-4 mr-2" />
                    New Contract
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <Users className="h-4 w-4 mr-2" />
                    Add Client
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        Contract &quot;Employment Agreement&quot; completed
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        Review needed for &quot;Service Contract&quot;
                      </p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        New client &quot;StartupXYZ&quot; added
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
