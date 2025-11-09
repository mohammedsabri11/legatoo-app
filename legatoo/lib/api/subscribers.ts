// Subscribers API functions

import { authUtils } from "../auth-utils";

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
  const hasValidToken = await authUtils.ensureValidToken();
  if (!hasValidToken) {
    throw {
      status: 401,
      message: "Authentication required. Please login again.",
      errors: {},
    };
  }

  let token = authUtils.getAccessToken();
  if (!token) {
    throw {
      status: 401,
      message: "Authentication required. Please login again.",
      errors: {},
    };
  }

  // Debug logging
  console.log("🔗 API Call:", {
    url,
    method: options.method || "GET",
    endpoint,
    apiBaseUrl: API_BASE_URL,
    envVar: process.env.NEXT_PUBLIC_API_URL,
  });

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  try {
    console.log("📡 Fetching:", url);
    const response = await fetch(url, config);

    // Handle 401 Unauthorized - try to refresh token and retry once
    if (response.status === 401 && retryOn401) {
      console.log("🔄 401 Unauthorized, attempting token refresh...");
      const refreshed = await authUtils.refreshAccessToken();
      
      if (refreshed) {
        // Get the new token
        token = authUtils.getAccessToken();
        if (!token) {
          throw {
            status: 401,
            message: "Authentication required. Please login again.",
            errors: {},
          };
        }

        // Update headers with new token
        headers.set("Authorization", `Bearer ${token}`);
        const retryConfig: RequestInit = {
          ...options,
          headers: headers,
        };
        
        // Retry the request once
        console.log("🔄 Retrying request with new token...");
        const retryResponse = await fetch(url, retryConfig);
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw {
            status: retryResponse.status,
            message: errorData.message || "An error occurred",
            errors: errorData.errors || {},
          };
        }
        
        const data = await retryResponse.json();
        return data;
      } else {
        // Token refresh failed, redirect to login
        console.error("❌ Token refresh failed, user needs to re-authenticate");
        if (typeof window !== "undefined") {
          authUtils.clearAuth();
          window.location.href = "/login";
        }
        throw {
          status: 401,
          message: "Authentication required. Please login again.",
          errors: {},
        };
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || "An error occurred",
        errors: errorData.errors || {},
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw {
        status: 500,
        message: error.message,
        errors: {},
      };
    }
    throw error;
  }
}

export interface Subscriber {
  subscription_id: string;
  user_id: string;
  name: string;
  email: string;
  phone_number: string | null;
  plan_name: string | null;
  plan_type: string | null;
  price: number;
  billing_cycle: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  is_active: boolean;
  days_remaining: number;
  auto_renew: boolean;
}

export interface SubscriberDetail extends Subscriber {
  account_type: string | null;
  plan_id: string;
  is_expired: boolean;
  is_cancelled: boolean;
}

export interface SubscribersResponse {
  success: boolean;
  message: string;
  data: {
    subscribers: Subscriber[];
    count: number;
  };
}

export interface SubscriberResponse {
  success: boolean;
  message: string;
  data: SubscriberDetail;
}

export interface CreateSubscriberData {
  user_id: string;
  plan_id: string;
  duration_days?: number;
}

export interface UpdateSubscriberData {
  plan_id?: string;
  status?: string;
  end_date?: string;
  auto_renew?: boolean;
}

export const subscribersApi = {
  // Get all subscribers
  getAll: async (skip: number = 0, limit: number = 100): Promise<SubscribersResponse> => {
    return apiCall<SubscribersResponse>(
      `/subscriptions/subscribers?skip=${skip}&limit=${limit}`
    );
  },

  // Get subscriber by ID
  getById: async (subscriptionId: string): Promise<SubscriberResponse> => {
    return apiCall<SubscriberResponse>(
      `/subscriptions/subscribers/${subscriptionId}`
    );
  },

  // Create subscriber
  create: async (data: CreateSubscriberData): Promise<SubscriberResponse> => {
    const params = new URLSearchParams();
    params.append("user_id", data.user_id);
    params.append("plan_id", data.plan_id);
    if (data.duration_days !== undefined) {
      params.append("duration_days", data.duration_days.toString());
    }

    return apiCall<SubscriberResponse>(
      `/subscriptions/subscribers?${params.toString()}`,
      {
        method: "POST",
      }
    );
  },

  // Update subscriber
  update: async (
    subscriptionId: string,
    data: UpdateSubscriberData
  ): Promise<SubscriberResponse> => {
    const params = new URLSearchParams();
    if (data.plan_id) params.append("plan_id", data.plan_id);
    if (data.status) params.append("status", data.status);
    if (data.end_date) params.append("end_date", data.end_date);
    if (data.auto_renew !== undefined) {
      params.append("auto_renew", data.auto_renew.toString());
    }

    return apiCall<SubscriberResponse>(
      `/subscriptions/subscribers/${subscriptionId}?${params.toString()}`,
      {
        method: "PUT",
      }
    );
  },

  // Delete subscriber
  delete: async (subscriptionId: string): Promise<{ success: boolean; message: string }> => {
    return apiCall<{ success: boolean; message: string }>(
      `/subscriptions/subscribers/${subscriptionId}`,
      {
        method: "DELETE",
      }
    );
  },
};
