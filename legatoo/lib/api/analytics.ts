// Analytics API functions for admin dashboard

import { authUtils } from "../auth-utils";

// Base API URL - you can change this to your actual API endpoint
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('fastestfranchise.net')
    ? "https://api.fastestfranchise.net/api/v1"
    : "http://localhost:8000/api/v1");

// Generic API call function with authentication and token refresh
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOn401: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Ensure token is valid before making request
  await authUtils.ensureValidToken();
  let token = authUtils.getAccessToken();

  // Prepare headers - use Headers object for proper merging
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Only set Content-Type for non-FormData requests that have a body
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized - try refreshing token once
    if (response.status === 401 && retryOn401) {
      console.log("🔄 Token expired, attempting refresh...");
      const refreshed = await authUtils.refreshAccessToken();
      
      if (refreshed) {
        // Retry the request with new token
        token = authUtils.getAccessToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        
        const retryConfig: RequestInit = {
          ...options,
          headers,
          credentials: "include",
        };
        
        const retryResponse = await fetch(url, retryConfig);
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          const error = new Error(errorData.message || `HTTP error! status: ${retryResponse.status}`) as Error & {
            status: number;
            data: unknown;
          };
          error.status = retryResponse.status;
          error.data = errorData;
          throw error;
        }
        
        return await retryResponse.json();
      } else {
        // Refresh failed, clear auth and redirect to login
        authUtils.clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = "/auth/login";
        }
        throw {
          status: 401,
          message: "Session expired. Please login again.",
          errors: {},
        };
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`) as Error & {
        status: number;
        data: unknown;
      };
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err.status) {
      throw error;
    }
    throw {
      status: 500,
      message: err.message || "Network error",
      errors: {},
    };
  }
}

export interface DashboardStats {
  online_users: number;
  total_users: number;
  errors_today: number;
  active_sessions: number;
  online_users_chart?: Array<{ timestamp: string; count: number }>;
}

export interface LoginHistoryRecord {
  id: number;
  user_id: number | null;
  user_email: string | null;
  user_name: string | null;
  login_time: string;
  ip_address: string | null;
  location: string | null;
  device: string | null;
  status: "success" | "failed";
  failure_reason: string | null;
}

export interface LoginHistoryResponse {
  total: number;
  records: LoginHistoryRecord[];
}

export interface SystemLogRecord {
  id: number;
  level: "info" | "warning" | "error" | "critical";
  message: string;
  stack_trace: string | null;
  endpoint: string | null;
  method: string | null;
  created_at: string;
  correlation_id: string | null;
  user_id: number | null;
}

export interface SystemLogsResponse {
  total: number;
  records: SystemLogRecord[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

// Analytics API
export const analyticsApi = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiCall<ApiResponse<DashboardStats>>("/admin/analytics/dashboard-stats", {
      method: "GET",
    });
  },

  // Get online users count
  getOnlineUsers: async (minutesThreshold: number = 1): Promise<ApiResponse<{ online_users: number }>> => {
    return apiCall<ApiResponse<{ online_users: number }>>(
      `/admin/analytics/online-users?minutes_threshold=${minutesThreshold}`,
      {
        method: "GET",
      }
    );
  },

  // Get online users over time
  getOnlineUsersOverTime: async (
    hours: number = 24,
    intervalMinutes: number = 30
  ): Promise<ApiResponse<{ chart_data: Array<{ timestamp: string; count: number }> }>> => {
    return apiCall<ApiResponse<{ chart_data: Array<{ timestamp: string; count: number }> }>>(
      `/admin/analytics/online-users/over-time?hours=${hours}&interval_minutes=${intervalMinutes}`,
      {
        method: "GET",
      }
    );
  },

  // Get login history
  getLoginHistory: async (params?: {
    user_id?: number;
    start_date?: string;
    end_date?: string;
    status?: "success" | "failed";
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<LoginHistoryResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.user_id) queryParams.append("user_id", params.user_id.toString());
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    return apiCall<ApiResponse<LoginHistoryResponse>>(
      `/admin/analytics/login-history?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
  },

  // Get system logs
  getSystemLogs: async (params?: {
    level?: "info" | "warning" | "error" | "critical";
    endpoint?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<SystemLogsResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.level) queryParams.append("level", params.level);
    if (params?.endpoint) queryParams.append("endpoint", params.endpoint);
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    return apiCall<ApiResponse<SystemLogsResponse>>(
      `/admin/analytics/system-logs?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
  },
};
