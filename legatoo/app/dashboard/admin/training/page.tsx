"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import {
  Brain,
  Play,
  Pause,
  BarChart3,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Settings,
  Download,
} from "lucide-react";

interface TrainingSession {
  id: string;
  name: string;
  status: 'idle' | 'training' | 'completed' | 'error';
  progress: number;
  startTime?: string;
  endTime?: string;
  accuracy: number;
  documentsUsed: number;
  modelVersion: string;
}

export default function AdminTrainingPage() {
  const { locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  
  const [isTraining, setIsTraining] = useState(false);
  // Mock training sessions
  const [trainingSessions] = useState<TrainingSession[]>([
    {
      id: "1",
      name: "Commercial Contracts v2.1",
      status: "completed",
      progress: 100,
      startTime: "2024-01-15T10:00:00Z",
      endTime: "2024-01-15T14:30:00Z",
      accuracy: 94.2,
      documentsUsed: 1247,
      modelVersion: "2.1.0"
    },
    {
      id: "2",
      name: "Employment Contracts v1.8",
      status: "completed",
      progress: 100,
      startTime: "2024-01-14T09:00:00Z",
      endTime: "2024-01-14T12:15:00Z",
      accuracy: 91.7,
      documentsUsed: 892,
      modelVersion: "1.8.0"
    },
    {
      id: "3",
      name: "Real Estate Contracts v3.0",
      status: "training",
      progress: 67,
      startTime: "2024-01-16T08:00:00Z",
      accuracy: 0,
      documentsUsed: 2156,
      modelVersion: "3.0.0"
    }
  ]);

  // Check if user is admin
  const isAdmin = user?.role === 'super_admin';

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

  const getStatusIcon = (status: TrainingSession['status']) => {
    switch (status) {
      case 'idle':
        return Clock;
      case 'training':
        return Brain;
      case 'completed':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: TrainingSession['status']) => {
    switch (status) {
      case 'idle':
        return 'text-gray-600 bg-gray-100';
      case 'training':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const startTraining = () => {
    setIsTraining(true);
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
    }, 5000);
  };

  const stopTraining = () => {
    setIsTraining(false);
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? "تدريب النموذج" : "Model Training"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? "إدارة وتدريب نماذج الذكاء الاصطناعي" : "Manage and train AI models"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button
              onClick={startTraining}
              disabled={isTraining}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRTL ? "بدء التدريب" : "Start Training"}
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Settings className="h-4 w-4 mr-2" />
              {isRTL ? "الإعدادات" : "Settings"}
            </button>
          </div>
        </div>

        {/* Current Training Status */}
        {isTraining && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-blue-600 mr-3 animate-pulse" />
                <div>
                  <h3 className="text-lg font-medium text-blue-900">
                    {isRTL ? "جاري التدريب..." : "Training in Progress..."}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {isRTL ? "نموذج العقود التجارية v3.1" : "Commercial Contracts Model v3.1"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm text-blue-700">45%</span>
                <button
                  onClick={stopTraining}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Pause className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Training Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? "النماذج المكتملة" : "Completed Models"}
                </p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? "متوسط الدقة" : "Average Accuracy"}
                </p>
                <p className="text-2xl font-bold text-gray-900">92.4%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? "المستندات المستخدمة" : "Documents Used"}
                </p>
                <p className="text-2xl font-bold text-gray-900">4,295</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? "تحسن الأداء" : "Performance Improvement"}
                </p>
                <p className="text-2xl font-bold text-gray-900">+8.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Sessions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {isRTL ? "جلسات التدريب" : "Training Sessions"}
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {trainingSessions.map((session) => {
              const StatusIcon = getStatusIcon(session.status);
              
              return (
                <div key={session.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Brain className="h-5 w-5 text-gray-600" />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {session.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {isRTL ? 'الإصدار:' : 'Version:'} {session.modelVersion} • 
                          {isRTL ? ' المستندات:' : ' Documents:'} {session.documentsUsed.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Status */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {session.status === 'idle' ? (isRTL ? 'في الانتظار' : 'Idle') :
                         session.status === 'training' ? (isRTL ? 'جاري التدريب' : 'Training') :
                         session.status === 'completed' ? (isRTL ? 'مكتمل' : 'Completed') :
                         session.status === 'error' ? (isRTL ? 'خطأ' : 'Error') : session.status}
                      </span>
                      
                      {/* Progress */}
                      {session.status === 'training' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${session.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{session.progress}%</span>
                        </div>
                      )}
                      
                      {/* Accuracy */}
                      {session.status === 'completed' && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {session.accuracy}% {isRTL ? 'دقة' : 'Accuracy'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.startTime && new Date(session.startTime).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {session.status === 'completed' && (
                          <>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <BarChart3 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {session.status === 'idle' && (
                          <button className="p-2 text-gray-400 hover:text-blue-600">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accuracy Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isRTL ? "اتجاهات الدقة" : "Accuracy Trends"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {isRTL ? "عقود تجارية" : "Commercial Contracts"}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">94%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {isRTL ? "عقود عمل" : "Employment Contracts"}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">91%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {isRTL ? "عقود عقارية" : "Real Estate Contracts"}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">87%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Training Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isRTL ? "توصيات التدريب" : "Training Recommendations"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isRTL ? "تحسين دقة العقود العقارية" : "Improve Real Estate Contract Accuracy"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRTL ? "أضف 200 عقد عقاري إضافي للتدريب" : "Add 200 more real estate contracts for training"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isRTL ? "تحسين سرعة المعالجة" : "Improve Processing Speed"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRTL ? "استخدم خوارزمية تحسين جديدة" : "Use new optimization algorithm"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isRTL ? "إضافة فئات جديدة" : "Add New Categories"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRTL ? "تدريب نموذج على عقود الخدمات" : "Train model on service contracts"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
