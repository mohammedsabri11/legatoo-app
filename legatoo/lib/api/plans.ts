// Plans API functions

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
  await authUtils.ensureValidToken();
  let token = authUtils.getAccessToken();

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
    const response = await fetch(url, config);

    // Handle 401 Unauthorized - try to refresh token and retry once
    if (response.status === 401 && retryOn401) {
      console.log("🔄 401 Unauthorized, attempting token refresh...");
      const refreshed = await authUtils.refreshAccessToken();
      
      if (refreshed) {
        // Get the new token
        token = authUtils.getAccessToken();
        if (token) {
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
        }
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

export interface Plan {
  plan_id: number | string;
  plan_name: string;
  plan_type: string;
  price: number;
  billing_cycle: string;
  file_limit: number | null;
  ai_message_limit: number | null;
  contract_limit: number | null;
  report_limit: number | null;
  token_limit: number | null;
  multi_user_limit: number | null;
  government_integration: boolean | null;
  description: string | null;
  is_active: boolean;
}

export interface PlansResponse {
  success: boolean;
  message: string;
  data: {
    plans: Plan[];
  };
}

export interface PlanResponse {
  success: boolean;
  message: string;
  data: Plan;
}

export interface CreatePlanData {
  plan_name: string;
  plan_type: string;
  price: number;
  billing_cycle: string;
  file_limit?: number | null;
  ai_message_limit?: number | null;
  contract_limit?: number | null;
  report_limit?: number | null;
  token_limit?: number | null;
  multi_user_limit?: number | null;
  government_integration?: boolean | null;
  description?: string | null;
  is_active?: boolean;
}

export const plansApi = {
  // Get all plans
  getAll: async (active_only: boolean = false): Promise<PlansResponse> => {
    return apiCall<PlansResponse>(
      `/subscriptions/plans?active_only=${active_only}`
    );
  },

  // Create plan
  create: async (data: CreatePlanData): Promise<PlanResponse> => {
    return apiCall<PlanResponse>(
      `/subscriptions/plans`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};

