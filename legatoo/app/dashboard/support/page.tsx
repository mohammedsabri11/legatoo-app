"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useAuth";
import { supportApi, SupportTicket } from "@/lib/api/support";
import {
  HelpCircle,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  Clock,
  MessageSquare,
  Trash2,
  Send,
  Loader2,
  Filter,
  Calendar,
  Tag,
  Sparkles,
  User,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

export default function SupportPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";
  const user = useUser();
  const { feedbackState, showFeedback, closeFeedback } = useFeedbackModal();
  
  // Get user role
  const userRole = user?.role || "user";
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = userRole === "admin";
  const isAdminUser = isAdmin || isSuperAdmin;

  // State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  
  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });
  const [submitting, setSubmitting] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [hasNewReplies, setHasNewReplies] = useState<Set<number>>(new Set());

  // Load tickets
  const loadTickets = async () => {
    if (!isAdmin && !isSuperAdmin) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = isAdminUser 
        ? await supportApi.getAllTickets(filterStatus || undefined)
        : await supportApi.getMyTickets(filterStatus || undefined);
      
      if (response.success) {
        setTickets(response.data.tickets);
        
        // Check for tickets with new replies (for regular users)
        if (!isSuperAdmin) {
          const repliedTickets = response.data.tickets
            .filter(t => t.admin_response && !hasNewReplies.has(t.id))
            .map(t => t.id);
          if (repliedTickets.length > 0) {
            setHasNewReplies(prev => new Set([...prev, ...repliedTickets]));
          }
        }
      } else {
        setError(response.message || t("dashboard.support.messages.failedToLoad"));
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || t("dashboard.support.messages.failedToLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isSuperAdmin) {
      loadTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, isAdminUser]);

  // Check if user has access
  if (!isAdmin && !isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t("dashboard.support.accessDenied")}
            </h2>
            <p className="text-gray-600">
              {t("dashboard.support.accessDeniedMessage")}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Create ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await supportApi.createTicket(formData);
      
      if (response.success) {
        setShowCreateModal(false);
        setFormData({ subject: "", description: "", category: "general", priority: "medium" });
        await loadTickets();
      } else {
        setError(response.message || t("dashboard.support.messages.failedToCreate"));
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || t("dashboard.support.messages.failedToCreate"));
    } finally {
      setSubmitting(false);
    }
  };

  // Submit admin response
  const handleSubmitResponse = async (ticketId: number) => {
    if (!adminResponse.trim()) return;

    setSubmitting(true);
    try {
      // When responding, mark as in_progress if still open, so user knows it's being handled
      const response = await supportApi.updateTicket(ticketId, {
        admin_response: adminResponse,
        status: selectedTicket?.status === "open" ? "in_progress" : undefined,
      });

      if (response.success) {
        setSelectedTicket(null);
        setAdminResponse("");
        await loadTickets();
        // Show success message
        showFeedback({
          variant: "success",
          title: isRTL ? "تم الإرسال" : "Response sent",
          message: t("dashboard.support.messages.responseSent") as string,
        });
      } else {
        setError(response.message || t("dashboard.support.messages.failedToUpdate"));
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || t("dashboard.support.messages.failedToUpdate"));
    } finally {
      setSubmitting(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = (ticketId: number) => {
    showFeedback({
      variant: "info",
      title: isRTL ? "تأكيد الحذف" : "Delete ticket?",
      message: t("dashboard.support.messages.deleteConfirm") as string,
      confirmLabel: isRTL ? "حذف" : "Delete",
      cancelLabel: t("dashboard.support.modal.cancel") as string,
      onConfirm: async () => {
        try {
          const response = await supportApi.deleteTicket(ticketId);
          if (response.success) {
            await loadTickets();
            setTimeout(() => {
              showFeedback({
                variant: "success",
                title: isRTL ? "تم الحذف" : "Deleted",
                message: isRTL ? "تم حذف التذكرة بنجاح." : "Ticket deleted successfully.",
              });
            }, 0);
          } else {
            setError(response.message || t("dashboard.support.messages.failedToDelete"));
            setTimeout(() => {
              showFeedback({
                variant: "error",
                title: isRTL ? "فشل الحذف" : "Delete failed",
                message:
                  response.message || (t("dashboard.support.messages.failedToDelete") as string),
              });
            }, 0);
          }
        } catch (err: unknown) {
          const error = err as { message?: string };
          setError(error.message || t("dashboard.support.messages.failedToDelete"));
          setTimeout(() => {
            showFeedback({
              variant: "error",
              title: isRTL ? "فشل الحذف" : "Delete failed",
              message:
                (error.message ||
                  (t("dashboard.support.messages.failedToDelete") as string)) ?? "",
            });
          }, 0);
        }
      },
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { 
        color: "bg-blue-50 text-blue-700 border-blue-200", 
        icon: Clock,
        dot: "bg-blue-500"
      },
      in_progress: { 
        color: "bg-amber-50 text-amber-700 border-amber-200", 
        icon: Clock,
        dot: "bg-amber-500"
      },
      resolved: { 
        color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
        icon: CheckCircle,
        dot: "bg-emerald-500"
      },
      closed: { 
        color: "bg-gray-50 text-gray-700 border-gray-200", 
        icon: X,
        dot: "bg-gray-500"
      },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const Icon = config.icon;
    const statusKey = status === "in_progress" ? "in_progress" : status;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.color} shadow-sm`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        <Icon className="h-3.5 w-3.5" />
        {t(`dashboard.support.status.${statusKey}` as never)}
      </span>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: "bg-slate-50 text-slate-700 border-slate-200",
      medium: "bg-blue-50 text-blue-700 border-blue-200",
      high: "bg-orange-50 text-orange-700 border-orange-200",
      urgent: "bg-red-50 text-red-700 border-red-200",
    };
    const color = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return (
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm ${color}`}>
        {t(`dashboard.support.priority.${priority}` as never)}
      </span>
    );
  };

  // Calculate stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved" || t.status === "closed").length,
  };

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
        {/* Modern Header with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 shadow-lg">
          <div className="relative p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl"></div>
                  <div className="relative p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
                    <HelpCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
                    {t("dashboard.support.title")}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {t("dashboard.support.subtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                {t("dashboard.support.createNewTicket")}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{t("dashboard.support.all")}</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary/40" />
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{t("dashboard.support.status.open")}</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-400/40" />
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{t("dashboard.support.status.in_progress")}</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
                  </div>
                  <Loader2 className="h-8 w-8 text-amber-400/40 animate-spin" />
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{t("dashboard.support.status.resolved")}</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-400/40" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 pt-6 border-t border-primary/10">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter className="h-4 w-4" />
                {t("dashboard.support.filterByStatus")}
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 max-w-xs px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              >
                <option value="">{t("dashboard.support.all")}</option>
                <option value="open">{t("dashboard.support.status.open")}</option>
                <option value="in_progress">{t("dashboard.support.status.in_progress")}</option>
                <option value="resolved">{t("dashboard.support.status.resolved")}</option>
                <option value="closed">{t("dashboard.support.status.closed")}</option>
              </select>
            </div>

            {isSuperAdmin && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">
                    {t("dashboard.support.superAdminNotice")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-xl shadow-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Tickets List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t("dashboard.support.tickets")}
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                  <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
                </div>
                <p className="mt-4 text-sm text-gray-500">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
                  <MessageSquare className="relative h-16 w-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("dashboard.support.noTicketsFound")}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Create your first support ticket to get started
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  {t("dashboard.support.createNewTicket")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                      ticket.admin_response 
                        ? "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-300" 
                        : "border-gray-200 bg-white hover:border-primary/30 hover:bg-gray-50/50"
                    }`}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      if (hasNewReplies.has(ticket.id)) {
                        setHasNewReplies(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(ticket.id);
                          return newSet;
                        });
                      }
                    }}
                  >
                    {ticket.admin_response && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    )}
                    <div className="relative p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {ticket.subject}
                            </h3>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                            {ticket.admin_response && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                                <CheckCircle className="h-3.5 w-3.5" />
                                {t("dashboard.support.replied")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                            {ticket.description}
                          </p>
                          {ticket.admin_response && (
                            <div className="mb-3 p-3 bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Tag className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-700">
                                  {t("dashboard.support.supportReply")}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                                {ticket.admin_response.substring(0, 120)}
                                {ticket.admin_response.length > 120 ? "..." : ""}
                              </p>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg font-medium">
                              <Tag className="h-3 w-3" />
                              {t(`dashboard.support.category.${ticket.category}` as never) || ticket.category}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                            {ticket.resolved_at && (
                              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                                <CheckCircle className="h-3 w-3" />
                                {t("dashboard.support.resolved")} {new Date(ticket.resolved_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          {/* User Information */}
                          {ticket.user && isSuperAdmin && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                  <User className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-900 truncate">
                                    {ticket.user.full_name}
                                  </div>
                                  <div className="flex items-center gap-3 text-gray-500 mt-0.5">
                                    <span className="inline-flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      <span className="truncate max-w-[150px]">{ticket.user.email}</span>
                                    </span>
                                    {ticket.user.phone && (
                                      <span className="inline-flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {ticket.user.phone}
                                      </span>
                                    )}
                                    {ticket.user.role && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                                        <Shield className="h-3 w-3" />
                                        {ticket.user.role}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {ticket.admin_response && (
                            <div className="flex flex-col items-center gap-2">
                              {hasNewReplies.has(ticket.id) && (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                  <div className="relative w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                                </div>
                              )}
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                hasNewReplies.has(ticket.id) 
                                  ? "bg-red-100 text-red-700 border border-red-200" 
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              }`}>
                                {hasNewReplies.has(ticket.id) 
                                  ? t("dashboard.support.newReply")
                                  : t("dashboard.support.replied")
                                }
                              </span>
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket.id);
                            }}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t("dashboard.support.modal.createTitle")}
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("dashboard.support.modal.subject")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder={t("dashboard.support.modal.subjectPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("dashboard.support.modal.description")}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder={t("dashboard.support.modal.descriptionPlaceholder")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("dashboard.support.modal.category")}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                    >
                      <option value="general">{t("dashboard.support.category.general")}</option>
                      <option value="technical">{t("dashboard.support.category.technical")}</option>
                      <option value="billing">{t("dashboard.support.category.billing")}</option>
                      <option value="bug_report">{t("dashboard.support.category.bug_report")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("dashboard.support.modal.priority")}
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as "low" | "medium" | "high" | "urgent" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                    >
                      <option value="low">{t("dashboard.support.priority.low")}</option>
                      <option value="medium">{t("dashboard.support.priority.medium")}</option>
                      <option value="high">{t("dashboard.support.priority.high")}</option>
                      <option value="urgent">{t("dashboard.support.priority.urgent")}</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    {t("dashboard.support.modal.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        {t("dashboard.support.modal.createTicket")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    {selectedTicket.subject}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    setAdminResponse("");
                  }}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* User Information Section */}
                {selectedTicket.user && isSuperAdmin && (
                  <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-5 border border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                          {isRTL ? "معلومات المستخدم" : "Ticket Creator"}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-lg font-bold text-gray-900">
                                {selectedTicket.user.full_name}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">{selectedTicket.user.email}</span>
                            </div>
                            {selectedTicket.user.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700">{selectedTicket.user.phone}</span>
                              </div>
                            )}
                            {selectedTicket.user.role && (
                              <div className="flex items-center gap-2 text-sm">
                                <Shield className="h-4 w-4 text-gray-400" />
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                                  {selectedTicket.user.role}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        {t(`dashboard.support.category.${selectedTicket.category}` as never) || selectedTicket.category}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedTicket.description}</p>
                    </div>
                  </div>
                </div>

                {selectedTicket.admin_response && (
                  <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 border-2 border-emerald-300 rounded-xl p-5 shadow-lg">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                          </div>
                          <h3 className="font-bold text-gray-900">
                            {t("dashboard.support.modal.yourTicketReplied")}
                          </h3>
                        </div>
                        {selectedTicket.admin && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-emerald-200/50">
                            <Shield className="h-4 w-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-gray-700">
                              {selectedTicket.admin.full_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-sm">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedTicket.admin_response}</p>
                        {selectedTicket.resolved_at && (
                          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            {t("dashboard.support.modal.resolvedAt")} {new Date(selectedTicket.resolved_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {!selectedTicket.admin_response && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                      </div>
                      <p className="text-sm font-medium text-blue-900">
                        {t("dashboard.support.modal.waitingForResponse")}
                      </p>
                    </div>
                  </div>
                )}

                {isSuperAdmin && !selectedTicket.admin_response && (
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t("dashboard.support.modal.supportResponse")}
                    </label>
                    <textarea
                      rows={5}
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder={t("dashboard.support.modal.responsePlaceholder")}
                    />
                    <button
                      onClick={() => handleSubmitResponse(selectedTicket.id)}
                      disabled={submitting || !adminResponse.trim()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t("dashboard.support.modal.sendResponse")}
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {t("dashboard.support.created")} {new Date(selectedTicket.created_at).toLocaleString()}
                  </span>
                  {selectedTicket.updated_at && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {t("dashboard.support.lastUpdated")} {new Date(selectedTicket.updated_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <FeedbackModal
        isOpen={feedbackState.isOpen}
        onClose={closeFeedback}
        title={feedbackState.title}
        message={feedbackState.message}
        variant={feedbackState.variant}
        onConfirm={feedbackState.onConfirm}
        confirmLabel={feedbackState.confirmLabel}
        cancelLabel={feedbackState.cancelLabel}
        isRTL={isRTL}
      />
    </DashboardLayout>
  );
}
