"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useUser,
  useProfile,
  useLogout,
  useTokenRefresh,
} from "@/hooks/useAuth";
import { LanguageToggle } from "@/components/ui";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Menu,
  X,
  Home,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Upload,
  Crown,
  Shield,
  Scale,
  FolderOpen,
  FileCheck,
  Brain,
  Users2,
  Library,
  Edit3,
  ShieldCheck,
  Copyright,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Plug,
  ChevronRight,
  ChevronLeft,
  Gavel,
  MessageSquare,
  Package,
  HelpCircle,
  Lock,
  ClipboardList,
  Sparkles,
  FileEdit,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t, locale } = useTranslation();
  const user = useUser();
  const profile = useProfile();
  const logoutMutation = useLogout();

  // Start automatic token refresh
  useTokenRefresh();

  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Desktop sidebar collapsed state (persisted to localStorage)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>(() => {
    // Initialize from localStorage or default values
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-expanded-sections");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {
            aiAssistant: false,
            caseManagement: false,
            contractsHub: false,
            complianceRisk: false,
            analyticsReports: false,
            adminPanel: false,
          };
        }
      }
    }
    return {
      aiAssistant: false,
      caseManagement: false,
      contractsHub: false,
      complianceRisk: false,
      analyticsReports: false,
      adminPanel: false,
    };
  });
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with real data from your API
  const unreadNotifications = 3;
  const userSubscription = "Pro"; // Could be 'Basic', 'Pro', 'Enterprise'
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Save expanded sections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "dashboard-expanded-sections",
      JSON.stringify(expandedSections)
    );
  }, [expandedSections]);

  // Save desktop collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "dashboard-sidebar-collapsed",
      JSON.stringify(isDesktopCollapsed)
    );
  }, [isDesktopCollapsed]);

  // Auto-collapse sections when sidebar is collapsed
  useEffect(() => {
    if (isDesktopCollapsed) {
      setExpandedSections((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          newState[key] = false;
        });
        return newState;
      });
    }
  }, [isDesktopCollapsed]);

  // Auto-expand sections based on current pathname (only when sidebar is not collapsed)
  useEffect(() => {
    if (isDesktopCollapsed) return;
    const autoExpandSections = () => {
      const newExpandedSections = { ...expandedSections };

      // Check which section should be expanded based on current pathname
      if (
        pathname.startsWith("/dashboard/legal-assistant") ||
        pathname.startsWith("/dashboard/ai-analysis") ||
        pathname.startsWith("/dashboard/contract-analyse-ai")
      ) {
        newExpandedSections.aiAssistant = true;
      }

      // Note: caseManagement is locked, so don't auto-expand it
      // if (
      //   pathname.startsWith("/dashboard/cases") ||
      //   pathname.startsWith("/dashboard/class-actions")
      // ) {
      //   newExpandedSections.caseManagement = true;
      // }

      if (
        pathname.startsWith("/dashboard/templates") ||
        pathname.startsWith("/dashboard/contracts") ||
        pathname.startsWith("/dashboard/contracts-library") ||
        pathname.startsWith("/dashboard/smart-editor")
      ) {
        newExpandedSections.contractsHub = true;
      }

      // Note: complianceRisk is locked, so don't auto-expand it
      // if (
      //   pathname.startsWith("/dashboard/compliance") ||
      //   pathname.startsWith("/dashboard/ip-protection") ||
      //   pathname.startsWith("/dashboard/fraud-detection")
      // ) {
      //   newExpandedSections.complianceRisk = true;
      // }

      // Note: analyticsReports is locked, so don't auto-expand it
      // if (
      //   pathname.startsWith("/dashboard/compliance-score") ||
      //   pathname.startsWith("/dashboard/reports")
      // ) {
      //   newExpandedSections.analyticsReports = true;
      // }

      // Auto-expand admin panel if on admin routes
      if (pathname.startsWith('/dashboard/admin')) {
        newExpandedSections.adminPanel = true;
      }

      // Only update if there are changes
      const hasChanges = Object.keys(newExpandedSections).some(
        (key) => newExpandedSections[key] !== expandedSections[key]
      );

      if (hasChanges) {
        setExpandedSections(newExpandedSections);
      }
    };

    autoExpandSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (section: string) => {
    // Don't allow expanding sections when sidebar is collapsed
    if (isDesktopCollapsed) return;
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed((prev) => !prev);
  };

  // Get user role to determine navigation
  const userRole = user?.role || "user";
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = userRole === "admin";

  // Base navigation items (for all users)
  const baseNavigation = [
    {
      name: t("dashboard.navigation.dashboard"),
      href: "/dashboard",
      icon: Home,
      type: "single",
    },
  ];

  // SuperAdmin sees Admin Dashboard as main item
  const superAdminNavigation = isSuperAdmin
    ? [
        {
          name: t("dashboard.navigation.adminDashboard"),
          href: "/dashboard/admin",
          icon: BarChart3,
          type: "single",
         
        },
      ]
    : [];

  // Support navigation - Available for both Admin and SuperAdmin
  const supportNavigation = (isAdmin || isSuperAdmin)
    ? [
        {
          name: t("dashboard.navigation.support"),
          href: "/dashboard/support",
          icon: HelpCircle,
          type: "single",
        },
      ]
    : [];

  // Admin Panel Items - Only for SuperAdmin (all items as main items, not nested)
  const adminPanelNavigation = isSuperAdmin
        ? [  {
          name: t("dashboard.navigation.lawSourceList"),
          href: "/dashboard/admin/source-list",
          icon: Gavel,
          type: "single",
        },
        {
          name: t("dashboard.navigation.caseKnowledge"),
          href: "/dashboard/admin/upload-case",
          icon: Upload,
          type: "single",
        },
        {
          name: t("dashboard.navigation.documentManagement"),
          href: "/dashboard/admin/documents",
          icon: FileText,
          type: "single",
        },
        {
          name: t("dashboard.navigation.modelTraining"),
          href: "/dashboard/admin/training",
          icon: Brain,
          type: "single",
        },
        {
          name: t("dashboard.navigation.activityLogs"),
          href: "/dashboard/admin/analytics",
          icon: ClipboardList,
          type: "single",
        },
        {
          name: t("dashboard.navigation.subscribers"),
          href: "/dashboard/subscribers",
          icon: Users2,
          type: "single",
        },
        {
          name: t("dashboard.navigation.plans"),
          href: "/dashboard/plans",
          icon: Package,
          type: "single",
        },
      ]
    : [];

  // Regular user navigation (only for Admin, NOT for SuperAdmin)
  const regularUserNavigation = !isSuperAdmin
    ? [
        // AI Assistant Section
        {
          name: t("dashboard.navigation.legalAssistant"),
          href: "/dashboard/legal-assistant",  
          icon: Brain,
          type: "single",
          key: "aiAssistant",
        },
        {
          name: t("dashboard.navigation.aiCaseAnalysis"),
          href: "/dashboard/ai-analysis",
          icon: Brain,
          type: "single",
          key: "aiAssistant",
         
        },
        {
          name: t("dashboard.navigation.contractAnalyseAI"),
          href: "/dashboard/contract-analyse-ai",
          icon: FileText,
          type: "single",
          key: "aiAssistant",
        },
      
        {
          name: t("dashboard.navigation.contractsHub"),
          icon: FileText,
          href: "/dashboard",
          type: "section",
          key: "contractsHub",
          subItems: [
            {
              name: t("dashboard.navigation.contractsLibrary"),
              href: "/dashboard/contracts-library",
              icon: FileText,
            },
            {
              name: t("dashboard.navigation.aiContractGenerator"),
              href: "/dashboard/contracts-library/generate",
              icon: Sparkles,
            },
          ],
        },
        {
          name: t("dashboard.navigation.caseManagement"),
          icon: Scale,
          type: "section",
          key: "caseManagement",
          locked: true,
          subItems: [
            {
              name: t("dashboard.navigation.cases"),
              href: "/dashboard/cases",
              icon: FolderOpen,
            },
            {
              name: t("dashboard.navigation.classActions"),
              href: "/dashboard/class-actions",
              icon: Users2,
            },
          ],
        },
        {
          name: t("dashboard.navigation.complianceRisk"),
          icon: Shield,
          type: "section",
          href: "/dashboard",
          key: "complianceRisk",
          locked: true,
          subItems: [
            {
              name: t("dashboard.navigation.complianceManagement"),
              href: "/dashboard/compliance",
              icon: ShieldCheck,
            },
            {
              name: t("dashboard.navigation.ipCopyrightProtection"),
              href: "/dashboard/ip-protection",
              icon: Copyright,
            },
            {
              name: t("dashboard.navigation.fraudDetection"),
              href: "/dashboard/fraud-detection",
              icon: AlertTriangle,
            },
          ],
        },
        {
          name: t("dashboard.navigation.analyticsReports"),
          icon: BarChart3,
          type: "section",
          href: "/dashboard",
          key: "analyticsReports",
          locked: true,
          subItems: [
            {
              name: t("dashboard.navigation.complianceScoreDashboard"),
              href: "/dashboard/compliance-score",
              icon: TrendingUp,
            },
            {
              name: t("dashboard.navigation.performanceReports"),
              href: "/dashboard/reports",
              icon: BarChart3,
            },
          ],
        },
        {
          name: t("dashboard.navigation.integrations"),
          href: "/dashboard/integrations",
          icon: Plug,
          type: "single",
          locked: true,
        },
      ]
    : [];

  // Combine navigation based on user role
  const navigation = [
    ...baseNavigation,
    ...superAdminNavigation, // SuperAdmin: Admin Dashboard (main item)
    ...adminPanelNavigation, // SuperAdmin: Admin Panel items (main items)
    ...regularUserNavigation, // Admin only: regular navigation items (NOT for SuperAdmin)
    ...supportNavigation, // Both Admin and SuperAdmin: Support page
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "Enterprise":
        return {
          icon: Shield,
          color: "bg-purple-100 text-purple-800",
          iconColor: "text-purple-600",
        };
      case "Pro":
        return {
          icon: Crown,
          color: "bg-yellow-100 text-yellow-800",
          iconColor: "text-yellow-600",
        };
      default:
        return {
          icon: User,
          color: "bg-gray-100 text-gray-800",
          iconColor: "text-gray-600",
        };
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const isRTL = locale === "ar";
  return (
    <AuthGuard>
      <div
        className={`min-h-screen md:m-4 ${isRTL ? "rtl" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-transparent bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed shadow-sm inset-y-0 z-50 m-md-4 mt-2 transform transition-all duration-700 ease-linear lg:translate-x-0 ${
            isRTL
              ? `right-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`
              : `left-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
          }`}
          style={{ overflow: 'visible' }}
        >
          <div 
            className={`h-full rounded-2xl bg-neutral-50 flex flex-col relative ${
              isDesktopCollapsed ? "w-14" : "w-56"
            }`}
            style={{ overflow: 'visible', clipPath: 'none' }}
          >
          {/* Header */}
          <div className={`flex items-center ${isDesktopCollapsed ? "justify-center px-2" : "justify-center px-6"} pt-3 border-gray-200 md:h-20 flex-shrink-0 relative`}>
            {!isDesktopCollapsed && (
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Legatoo Logo"
                  width={150}
                  height={40}
                  className=""
                />
              </Link>
            )}
            {isDesktopCollapsed && (
              <Link href="/dashboard" className="flex items-center justify-center w-full">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">L</span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-3 p-2 rounded-md text-gray-400 hover:text-gray-600"
              style={isRTL ? { left: "0.5rem" } : { right: "0.5rem" }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col" style={{ overflow: 'visible', position: 'relative' }}>
            <div 
              className="flex-1 p-4" 
              style={{ 
            
                position: 'relative',
                clipPath: 'none'
              }}
            >
              <div className="space-y-1" style={{ position: 'relative', overflow: 'visible', clipPath: 'none' }}>
                {navigation.map((item) => {
                  const Icon = item.icon;

                  if (item.type === "single" && "href" in item) {
                    // More specific active check - only match if exact or if it's a sub-route
                    // Exclude base /dashboard from matching sub-routes
                    let isActive = false;
                    if (item.href === "/dashboard") {
                      // Base dashboard only active on exact match
                      isActive = pathname === "/dashboard" || pathname === "/dashboard/";
                    } else {
                      // For other routes, check exact match or if pathname starts with the href
                      isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/") ||
                        pathname.startsWith(item.href + "?") ||
                        pathname.startsWith(item.href + "#");
                    }
                    const isLocked = "locked" in item && item.locked;
                    return (
                      <div key={item.name} className="relative group/item" style={{ overflow: 'visible', position: 'relative' }}>
                        {isLocked ? (
                          <div
                            className={`flex items-center ${isDesktopCollapsed ? "justify-center px-2 w-full" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all duration-200 ease-in-out group text-gray-400 cursor-not-allowed opacity-50`}
                          >
                            <Icon
                              className={`${isDesktopCollapsed ? "h-5 w-5 flex-shrink-0" : isRTL ? "ml-3 h-5 w-5" : "mr-3 h-5 w-5"} transition-transform duration-200 text-gray-400`}
                            />
                            {!isDesktopCollapsed && (
                              <>
                                <span className={`flex-1 tracking-wide transition-opacity duration-700 font-semibold`}>{item.name}</span>
                                <Lock className="h-4 w-4 text-gray-400" />
                              </>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href || "#"}
                            className={`flex items-center ${isDesktopCollapsed ? "justify-center px-2 w-full" : "px-4"} py-3 text-sm font-semibold rounded-xl transition-all duration-200 ease-in-out group ${
                              isActive
                                ? "bg-primary text-white shadow-md shadow-primary/30"
                                : "text-gray-700 hover:bg-primary/10 hover:text-primary hover:shadow-sm hover:translate-x-0.5"
                            }`}
                          >
                            <Icon
                              className={`${isDesktopCollapsed ? "h-5 w-5 flex-shrink-0" : isRTL ? "ml-3 h-5 w-5" : "mr-3 h-5 w-5"} transition-transform duration-200 ${
                                isActive 
                                  ? "text-white" 
                                  : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                              }`}
                            />
                            {!isDesktopCollapsed && (
                              <>
                                <span className={`flex-1 tracking-wide transition-opacity duration-700 ${
                                  isActive ? "font-bold" : "font-semibold"
                                }`}>{item.name}</span>
                                {(() => {
                                  const badgeValue = "badge" in item ? item.badge : null;
                                  return badgeValue && typeof badgeValue === "string" ? (
                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all duration-200 ${
                                      isActive 
                                        ? "bg-white/25 text-white shadow-sm" 
                                        : "bg-amber-100 text-amber-700 group-hover:bg-amber-200 group-hover:text-amber-800 group-hover:shadow-sm"
                                    }`}>
                                      {badgeValue}
                                    </span>
                                  ) : null;
                                })()}
                              </>
                            )}
                          </Link>
                        )}
                        {/* Tooltip for collapsed state - positioned outside scroll container */}
                        {isDesktopCollapsed && (
                          <div 
                            className={`absolute z-[60] px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none shadow-lg`}
                            style={{ 
                              [isRTL ? 'right' : 'left']: isRTL ? 'calc(100% + 0.5rem)' : 'calc(100% + 0.5rem)',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              position: 'absolute',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.name}
                            <div 
                              className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent`}
                              style={{
                                [isRTL ? 'left' : 'right']: '100%',
                                borderColor: 'transparent',
                                [isRTL ? 'borderRightColor' : 'borderLeftColor']: '#111827'
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.type === "section" && "key" in item && "subItems" in item) {
                    const isExpanded = expandedSections[item.key];
                    const isLocked = "locked" in item && item.locked;
                    return (
                      <div key={item.name} className="relative group/item" style={{ overflow: 'visible', position: 'relative' }}>
                        <button
                          onClick={() => {
                            if (!isLocked) {
                              toggleSection(item.key);
                            }
                          }}
                          disabled={isLocked}
                          className={`flex items-center ${isDesktopCollapsed ? "justify-center px-2" : "justify-between px-4"} w-full py-3 text-sm font-semibold rounded-xl transition-all duration-200 ease-in-out group ${
                            isLocked
                              ? "text-gray-400 cursor-not-allowed opacity-50"
                              : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          <div className={`flex items-center ${isDesktopCollapsed ? "justify-center" : ""}`}>
                            <Icon
                              className={`${isDesktopCollapsed ? "h-5 w-5 flex-shrink-0" : isRTL ? "ml-3 h-5 w-5" : "mr-3 h-5 w-5"} transition-all duration-200 ${
                                isLocked
                                  ? "text-gray-400"
                                  : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                              }`}
                            />
                            {!isDesktopCollapsed && (
                              <span className="tracking-wide transition-opacity duration-700">{item.name}</span>
                            )}
                          </div>
                          {!isDesktopCollapsed && (
                            <>
                              {isLocked ? (
                                <Lock className="h-4 w-4 text-gray-400" />
                              ) : (
                                React.createElement(ChevronRight, {
                                  className: `h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-primary ${
                                    isExpanded
                                      ? isRTL
                                        ? "-rotate-90"
                                        : "rotate-90"
                                      : ""
                                  }`,
                                  style: isRTL ? { transform: "scaleX(-1)" } : {},
                                })
                              )}
                            </>
                          )}
                        </button>

                        {/* Tooltip for collapsed state - positioned outside scroll container */}
                        {isDesktopCollapsed && (
                          <div 
                            className={`absolute z-[60] px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none shadow-lg`}
                            style={{ 
                              [isRTL ? 'right' : 'left']: isRTL ? 'calc(100% + 0.5rem)' : 'calc(100% + 0.5rem)',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              position: 'absolute',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.name}
                            <div 
                              className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent`}
                              style={{
                                [isRTL ? 'left' : 'right']: '100%',
                                borderColor: 'transparent',
                                [isRTL ? 'borderRightColor' : 'borderLeftColor']: '#111827'
                              }}
                            ></div>
                          </div>
                        )}

                        {!isDesktopCollapsed && isExpanded && item.subItems && (
                          <div
                            className={`${
                              isRTL ? "mr-4" : "ml-4"
                            } mt-2 space-y-1`}
                          >
                            {item.subItems.map((subItem) => {
                              const SubIcon = subItem.icon;
                              const isSubItemActive =
                                pathname === subItem.href ||
                                (subItem.href !== "/dashboard/admin" && 
                                 (pathname.startsWith(subItem.href + "/") ||
                                  pathname.startsWith(subItem.href + "?") ||
                                  pathname.startsWith(subItem.href + "#")));
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ease-in-out group ${
                                    isSubItemActive
                                      ? "bg-primary text-white shadow-md shadow-primary/20 font-semibold"
                                      : "text-gray-600 hover:bg-primary/10 hover:text-primary hover:translate-x-1 font-medium"
                                  }`}
                                >
                                  <SubIcon
                                    className={`${
                                      isRTL ? "ml-3" : "mr-3"
                                    } h-4 w-4 transition-transform duration-200 ${
                                      isSubItemActive
                                        ? "text-white"
                                        : "text-gray-400 group-hover:text-primary group-hover:scale-110"
                                    }`}
                                  />
                                  <span className="tracking-wide">{subItem.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            {/* Logout Button at Bottom */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="relative group/item">
                <button
                  onClick={handleLogout}
                  className={`flex items-center ${isDesktopCollapsed ? "justify-center px-2 w-full" : "px-4"} w-full py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all duration-200 ease-in-out group`}
                >
                  <LogOut
                    className={`${isDesktopCollapsed ? "h-5 w-5 flex-shrink-0" : isRTL ? "ml-3 h-5 w-5" : "mr-3 h-5 w-5"} text-gray-500 transition-all duration-200 group-hover:text-red-600 group-hover:scale-110`}
                  />
                  {!isDesktopCollapsed && (
                    <span className="tracking-wide transition-opacity duration-700">{t("dashboard.header.logOut")}</span>
                  )}
                </button>
                {/* Tooltip for collapsed state */}
                {isDesktopCollapsed && (
                  <div className={`absolute bottom-full mb-2 z-[60] ${isRTL ? "right-0" : "left-1/2 -translate-x-1/2"} px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none shadow-lg`}>
                    {t("dashboard.header.logOut")}
                    <div className={`absolute top-full ${isRTL ? "right-4" : "left-1/2 -translate-x-1/2"} border-4 border-transparent border-t-gray-900`}></div>
                  </div>
                )}
              </div>
            </div>
          </nav>
          </div>
        </div>

        {/* Main content */}
        <div
          className={`min-h-screen ms-md-4 flex flex-col transition-all duration-700 ease-linear ${
            isRTL 
              ? isDesktopCollapsed ? "lg:pr-14" : "lg:pr-56"
              : isDesktopCollapsed ? "lg:pl-14" : "lg:pl-56"
          }`}
        >
          {/* Top header */}
          <header className="sticky shadow-sm top-0 z-40 bg-neutral-50 rounded-2xl py-1 md:h-14 border-gray-200 mb-2">
            <div
              className={`flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8 ${
                isRTL ? " w-full   " : ""
              }`}
            >
              <div
                className={`flex items-center flex-1 ${
                  isRTL ? "flex-row-r everse" : ""
                }`}
              >
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 ${
                    isRTL ? "ml-2" : "mr-2"
                  }`}
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Desktop Sidebar Toggle Button */}
                <button
                  onClick={toggleDesktopSidebar}
                  className={`hidden lg:flex p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ${
                    isRTL ? "ml-2" : "mr-2"
                  }`}
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Unified Search Bar */}
                <div className="flex-1  hidden md:block max-w-2xl">
                  <form onSubmit={handleSearch} className="relative">
                    <div
                      className={`absolute inset-y-0 flex items-center pointer-events-none ${
                        isRTL ? "right-0 pr-2" : "left-0 pl-2"
                      }`}
                    >
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("dashboard.header.searchPlaceholder")}
                      className={`block w-full py-1.5 rounded-lg leading-4 bg-white border border-gray-500 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:placeholder-gray-400 text-sm ${
                        isRTL ? "pr-8 pl-2 !text-right" : "pl-8 pr-2 text-left"
                      }`}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </form>
                </div>
              </div>

              <div
                className={`flex items-center ${
                  isRTL ? "space-x-reverse space-x-4 ml-4" : "space-x-4 mr-4"
                }`}
              >
                {/* Notifications with Badge */}
                <button className="relative p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="h-4 text-primary w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium text-[10px]">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Language Toggle Dropdown */}
                <LanguageToggle />

                {/* User Profile Area */}
                <div
                  className="relative   !border-primary rounded-lg "
                  ref={userMenuRef}
                >
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* User Profile Picture */}
                    <div className=" bg-primary rounded-full flex items-center justify-center relative">
                      {/* <span className="text-white font-semibold text-sm">
                        {profile?.first_name?.[0] ||
                          user?.email?.[0]?.toUpperCase()}
                        {profile?.last_name?.[0] || ""}
                      </span> */}
                      <Image src="/photo.jpeg" alt="Profile" width={32} height={32} className=" w-8 h-8  rounded-full" />
                      {/* Subscription Badge */}
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                          getSubscriptionBadge(userSubscription).color
                        }`}
                      >
                        {React.createElement(
                          getSubscriptionBadge(userSubscription).icon,
                          {
                            className: `h-2.5 w-2.5 ${
                              getSubscriptionBadge(userSubscription).iconColor
                            }`,
                          }
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                   

                  </button>

                  {/* User Menu Dropdown */}
                  {userMenuOpen && (
                    <div
                      className={`absolute mt-2 w-56 bg-white rounded-lg shadow-lg border !border-primary py-1 z-50 ${
                        isRTL ? "left-0" : "right-0"
                      }`}
                    >
                      <div className="px-4 py-3 border-b !border-primary">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.first_name || user?.email}{" "}
                          {profile?.last_name || ""}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              getSubscriptionBadge(userSubscription).color
                            }`}
                          >
                            {userSubscription} Plan
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User
                          className={`h-4 w-4 ${isRTL ? "ml-3" : "mr-3"}`}
                        />
                        {t("dashboard.header.profile")}
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings
                          className={`h-4 w-4 ${isRTL ? "ml-3" : "mr-3"}`}
                        />
                        {t("dashboard.header.accountSettings")}
                      </Link>

                      <Link
                        href="/dashboard/subscription"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Crown
                          className={`h-4 w-4 ${isRTL ? "ml-3" : "mr-3"}`}
                        />
                        {t("dashboard.header.manageSubscription")}
                      </Link>

                      <div className="border-t !border-primary my-1"></div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut
                          className={`h-4 w-4 ${isRTL ? "ml-3" : "mr-3"}`}
                        />
                        {t("dashboard.header.logOut")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            <div className="pt-2 pb-2">
              <div className=" mx-auto px-4 p-4 sm:px-6 lg:px-8 rounded-2xl  shadow-sm bg-neutral-50">
                {children}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-neutral-100  rounded-2xl  border-gray-200 mt-auto">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-5">
              {/* Bottom Section */}
              <div className="    border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                    <p className="text-sm text-gray-500">
                      {t("dashboard.footer.copyright")}
                    </p>
                    <div className="flex space-x-6">
                      <Link
                        href="/privacy"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {t("dashboard.footer.privacyPolicy")}
                      </Link>
                      <Link
                        href="/terms"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {t("dashboard.footer.termsOfService")}
                      </Link>
                      <Link
                        href="/cookies"
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {t("dashboard.footer.cookiePolicy")}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="text-sm text-gray-500">
                      {t("dashboard.footer.version")} •{" "}
                      {t("dashboard.footer.lastUpdated")}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
