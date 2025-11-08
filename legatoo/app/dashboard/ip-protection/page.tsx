"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Copyright, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Eye,
  Download,
  Edit3,
  Shield,
  Lock,
  Globe,
  Users,
  TrendingUp,
  BarChart3
} from "lucide-react";

export default function IPProtectionPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [selectedType, setSelectedType] = useState('all');

  // Mock data - replace with real data from your API
  const ipAssets = [
    {
      id: 1,
      name: "Legatoo Legal Platform",
      type: "Patent",
      status: "active",
      registrationNumber: "US-2024-001234",
      registrationDate: "2024-01-15",
      expiryDate: "2044-01-15",
      owner: "Legatoo Inc",
      description: "AI-powered legal document analysis system",
      value: 2500000,
      documents: 8,
      infringements: 0
    },
    {
      id: 2,
      name: "Smart Contract Generator",
      type: "Copyright",
      status: "active",
      registrationNumber: "©-2024-567890",
      registrationDate: "2024-01-10",
      expiryDate: "2074-01-10",
      owner: "Legatoo Inc",
      description: "Automated contract generation software",
      value: 1500000,
      documents: 5,
      infringements: 1
    },
    {
      id: 3,
      name: "LegalAI Brand Logo",
      type: "Trademark",
      status: "pending",
      registrationNumber: "TM-2024-789012",
      registrationDate: "2024-01-05",
      expiryDate: "2034-01-05",
      owner: "Legatoo Inc",
      description: "Company logo and brand identity",
      value: 500000,
      documents: 3,
      infringements: 0
    },
    {
      id: 4,
      name: "Client Database Schema",
      type: "Trade Secret",
      status: "active",
      registrationNumber: "TS-2024-345678",
      registrationDate: "2024-01-01",
      expiryDate: "N/A",
      owner: "Legatoo Inc",
      description: "Proprietary database design and algorithms",
      value: 800000,
      documents: 12,
      infringements: 0
    }
  ];

  const infringementReports = [
    {
      id: 1,
      assetName: "Smart Contract Generator",
      infringer: "TechCorp Solutions",
      type: "Copyright Infringement",
      severity: "high",
      reportedDate: "2024-01-18",
      status: "investigating",
      description: "Unauthorized use of contract generation algorithms",
      estimatedDamages: 500000
    },
    {
      id: 2,
      assetName: "LegalAI Brand Logo",
      infringer: "LegalTech Inc",
      type: "Trademark Infringement",
      severity: "medium",
      reportedDate: "2024-01-15",
      status: "resolved",
      description: "Similar logo design causing brand confusion",
      estimatedDamages: 100000
    }
  ];

  const types = [
    { id: 'all', name: isRTL ? 'الكل' : 'All', count: ipAssets.length },
    { id: 'Patent', name: isRTL ? 'براءة اختراع' : 'Patent', count: ipAssets.filter(a => a.type === 'Patent').length },
    { id: 'Copyright', name: isRTL ? 'حقوق الطبع والنشر' : 'Copyright', count: ipAssets.filter(a => a.type === 'Copyright').length },
    { id: 'Trademark', name: isRTL ? 'علامة تجارية' : 'Trademark', count: ipAssets.filter(a => a.type === 'Trademark').length },
    { id: 'Trade Secret', name: isRTL ? 'سر تجاري' : 'Trade Secret', count: ipAssets.filter(a => a.type === 'Trade Secret').length }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Patent':
        return 'bg-blue-100 text-blue-800';
      case 'Copyright':
        return 'bg-green-100 text-green-800';
      case 'Trademark':
        return 'bg-purple-100 text-purple-800';
      case 'Trade Secret':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const filteredAssets = selectedType === 'all' 
    ? ipAssets 
    : ipAssets.filter(asset => asset.type === selectedType);

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'حماية الملكية الفكرية' : 'IP & Copyright Protection'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'إدارة وحماية الأصول الفكرية وحقوق الطبع والنشر' : 'Manage and protect intellectual property and copyright assets'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تسجيل أصل فكري جديد' : 'Register New IP Asset'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Copyright className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'إجمالي الأصول' : 'Total Assets'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{ipAssets.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'الأصول النشطة' : 'Active Assets'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {ipAssets.filter(a => a.status === 'active').length}
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
                      {isRTL ? 'انتهاكات نشطة' : 'Active Infringements'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {infringementReports.filter(r => r.status !== 'resolved').length}
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
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`ml-5 w-0 flex-1 ${isRTL ? 'mr-5 ml-0' : ''}`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {isRTL ? 'القيمة الإجمالية' : 'Total Value'}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${ipAssets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isRTL ? 'نوع الأصول' : 'Asset Type'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedType === type.id
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
                  placeholder={isRTL ? "البحث في الأصول الفكرية..." : "Search IP assets..."}
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

        {/* IP Assets Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isRTL ? 'الأصول الفكرية' : 'Intellectual Property Assets'}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الأصل' : 'Asset'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'النوع' : 'Type'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'رقم التسجيل' : 'Registration #'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'القيمة' : 'Value'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    </th>
                    <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Lock className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className={`ml-4 ${isRTL ? 'mr-4 ml-0 text-right' : 'text-left'}`}>
                            <div className="text-sm font-medium text-gray-900">
                              {asset.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {asset.documents} {isRTL ? 'وثيقة' : 'docs'} • {asset.infringements} {isRTL ? 'انتهاك' : 'infringements'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(asset.type)}`}>
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                          {asset.status === 'active' ? (isRTL ? 'نشط' : 'Active') :
                           asset.status === 'pending' ? (isRTL ? 'معلق' : 'Pending') :
                           asset.status === 'expired' ? (isRTL ? 'منتهي' : 'Expired') : asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.registrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${asset.value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.expiryDate === 'N/A' ? 'N/A' : new Date(asset.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary hover:text-primary/80">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
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

        {/* Infringement Reports */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'تقارير الانتهاكات' : 'Infringement Reports'}
          </h3>
          <div className="space-y-3">
            {infringementReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3  shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                    <div className="text-sm font-medium text-gray-900">
                      {report.assetName} - {report.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.infringer} • {report.description} • ${report.estimatedDamages.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    report.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status === 'resolved' ? (isRTL ? 'محلول' : 'Resolved') :
                     report.status === 'investigating' ? (isRTL ? 'قيد التحقيق' : 'Investigating') :
                     report.status === 'pending' ? (isRTL ? 'معلق' : 'Pending') : report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isRTL ? 'التجديدات القادمة' : 'Upcoming Renewals'}
          </h3>
          <div className="space-y-3">
            {ipAssets
              .filter(asset => asset.expiryDate !== 'N/A' && asset.status === 'active')
              .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
              .slice(0, 5)
              .map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {asset.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {asset.type} • ينتهي في {new Date(asset.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(asset.type)}`}>
                    {asset.type}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


