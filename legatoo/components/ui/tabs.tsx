"use client";

import React, { useState } from "react";
import { FileText, FolderOpen } from "lucide-react";

export interface Tab {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  isRTL?: boolean;
  defaultTab?: string;
}

export function Tabs({ tabs, isRTL = false, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Tab Headers */}   
      <div className="">
        <nav className={`-mb-px flex space-x-8 ${
          isRTL ?  "":"flex-row-reverse space-x-reverse"
        }`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-4  px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-white bg-primary   rounded-md"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`${isRTL ? "ml-2" : "mr-2"} ${
                activeTab === tab.id ? "text-white" : "text-gray-400 group-hover:text-gray-500"
              }`}>
                {tab.icon}
              </span>
              {isRTL ? tab.labelAr : tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTabData?.content}
      </div>
    </div>
  );
}

// Predefined tabs for Case Analysis and Case Management
export const CaseTabs = {
  analysis: {
    id: "analysis",
    label: "Case Analysis",
    labelAr: "تحليل القضايا",
    icon: <FileText className="h-5 w-5" />,
  },
  management: {
    id: "management", 
    label: "Case Management",
    labelAr: "إدارة القضايا",
    icon: <FolderOpen className="h-5 w-5" />,
  },
};
