"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import {
  FileText,
  Image,
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Edit,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'processed' | 'processing' | 'error';
  category: string;
  tags: string[];
  analysis?: {
    confidence: number;
    keyPoints: string[];
    contractType: string;
  };
}

export default function AdminDocumentsPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Check if user is admin
  const isAdmin =  user?.role === 'super_admin';

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
              {isRTL ? "تحتاج إلى صلاحيات المدير للوصول إلى هذه الصفحة" : "You need admin privileges to access this page"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Mock data
  const documents: Document[] = [
    {
      id: "1",
      name: "Commercial Lease Agreement.pdf",
      type: "application/pdf",
      size: 2.4,
      uploadDate: "2024-01-15",
      status: "processed",
      category: "Commercial",
      tags: ["lease", "commercial", "property"],
      analysis: {
        confidence: 94,
        keyPoints: ["Rent amount", "Lease duration", "Maintenance responsibilities"],
        contractType: "Commercial Lease"
      }
    },
    {
      id: "2",
      name: "Employment Contract.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 1.8,
      uploadDate: "2024-01-14",
      status: "processed",
      category: "Employment",
      tags: ["employment", "salary", "benefits"],
      analysis: {
        confidence: 87,
        keyPoints: ["Salary", "Job responsibilities", "Benefits package"],
        contractType: "Employment Agreement"
      }
    },
    {
      id: "3",
      name: "Service Agreement.pdf",
      type: "application/pdf",
      size: 3.2,
      uploadDate: "2024-01-13",
      status: "processing",
      category: "Service",
      tags: ["service", "consulting", "terms"],
    },
    {
      id: "4",
      name: "NDA Template.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 0.9,
      uploadDate: "2024-01-12",
      status: "error",
      category: "Legal",
      tags: ["nda", "confidentiality", "template"],
    },
  ];

  const categories = ["all", "Commercial", "Employment", "Service", "Legal", "Real Estate"];
  const statuses = ["all", "processed", "processing", "error"];

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return FileText;
    if (type.includes("word") || type.includes("document")) return FileText;
    if (type.includes("csv") || type.includes("spreadsheet")) return FileSpreadsheet;
    if (type.includes("image")) return Image;
    return FileText;
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return CheckCircle;
      case 'processing':
        return Clock;
      case 'error':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "إدارة المستندات" : "Document Management"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? "عرض وإدارة جميع المستندات المرفوعة" : "View and manage all uploaded documents"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Download className="h-4 w-4 mr-2" />
              {isRTL ? "تصدير البيانات" : "Export Data"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={isRTL ? "البحث في المستندات..." : "Search documents..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {isRTL ? 
                      (category === "all" ? "جميع الفئات" : category) :
                      (category === "all" ? "All Categories" : category)
                    }
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {isRTL ? 
                      (status === "all" ? "جميع الحالات" : 
                       status === "processed" ? "مكتمل" :
                       status === "processing" ? "جاري المعالجة" :
                       status === "error" ? "خطأ" : status) :
                      (status === "all" ? "All Status" : status)
                    }
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const FileIcon = getFileIcon(doc.type);
            const StatusIcon = getStatusIcon(doc.status);
            
            return (
              <div key={doc.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {doc.size} MB • {doc.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {doc.status === 'processed' ? (isRTL ? 'مكتمل' : 'Processed') :
                         doc.status === 'processing' ? (isRTL ? 'معالجة' : 'Processing') :
                         doc.status === 'error' ? (isRTL ? 'خطأ' : 'Error') : doc.status}
                      </span>
                      
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{doc.tags.length - 3} {isRTL ? 'أخرى' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Analysis Results */}
                  {doc.analysis && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">
                          {isRTL ? 'نوع العقد:' : 'Contract Type:'}
                        </span>
                        <span className="text-xs text-gray-600">
                          {doc.analysis.confidence}% {isRTL ? 'ثقة' : 'confidence'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{doc.analysis.contractType}</p>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">{isRTL ? 'النقاط الرئيسية:' : 'Key Points:'}</span>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {doc.analysis.keyPoints.slice(0, 2).map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Date */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    {isRTL ? 'تم الرفع:' : 'Uploaded:'} {new Date(doc.uploadDate).toLocaleDateString()}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isRTL ? "لا توجد مستندات" : "No documents found"}
            </h3>
            <p className="text-gray-500">
              {isRTL ? "لم يتم العثور على مستندات تطابق معايير البحث" : "No documents match your search criteria"}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isRTL ? "إحصائيات المستندات" : "Document Statistics"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
              <div className="text-sm text-gray-500">{isRTL ? 'إجمالي المستندات' : 'Total Documents'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'processed').length}
              </div>
              <div className="text-sm text-gray-500">{isRTL ? 'مكتملة' : 'Processed'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.status === 'processing').length}
              </div>
              <div className="text-sm text-gray-500">{isRTL ? 'قيد المعالجة' : 'Processing'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {documents.filter(d => d.status === 'error').length}
              </div>
              <div className="text-sm text-gray-500">{isRTL ? 'أخطاء' : 'Errors'}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
