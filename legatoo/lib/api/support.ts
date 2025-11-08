// Support Tickets API functions

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
  
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
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
        
        const retryResponse = await fetch(url, {
          ...config,
          headers,
        });
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw {
            status: retryResponse.status,
            message: errorData.message || "Request failed",
            errors: errorData.errors || {},
          };
        }
        
        return retryResponse.json();
      } else {
        // Refresh failed, clear auth and redirect to login
        authUtils.clearAuth();
        window.location.href = "/auth/login";
        throw {
          status: 401,
          message: "Session expired. Please login again.",
          errors: {},
        };
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || "Request failed",
        errors: errorData.errors || {},
      };
    }

    return response.json();
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

export interface TicketUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  admin_response?: string | null;
  admin_id?: number | null;
  attachments?: string | null;
  created_at: string;
  updated_at?: string | null;
  resolved_at?: string | null;
  user?: TicketUser | null;
  admin?: TicketUser | null;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category: string;
  priority?: "low" | "medium" | "high" | "urgent";
}

export interface UpdateTicketData {
  subject?: string;
  description?: string;
  status?: "open" | "in_progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  admin_response?: string;
}

export interface TicketsResponse {
  success: boolean;
  message: string;
  data: {
    tickets: SupportTicket[];
    count: number;
  };
  errors?: Array<Record<string, unknown>>;
}

export interface TicketResponse {
  success: boolean;
  message: string;
  data: SupportTicket;
  errors?: Array<Record<string, unknown>>;
}

export const supportApi = {
  // Get user's tickets
  getMyTickets: async (status?: string, skip: number = 0, limit: number = 100): Promise<TicketsResponse> => {
    const statusParam = status ? `&status=${status}` : "";
    return apiCall<TicketsResponse>(`/support/tickets?skip=${skip}&limit=${limit}${statusParam}`);
  },

  // Get all tickets (admin only)
  getAllTickets: async (status?: string, category?: string, skip: number = 0, limit: number = 100): Promise<TicketsResponse> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (category) params.append("category", category);
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());
    return apiCall<TicketsResponse>(`/support/tickets/all?${params.toString()}`);
  },

  // Get single ticket
  getTicket: async (ticketId: number): Promise<TicketResponse> => {
    return apiCall<TicketResponse>(`/support/tickets/${ticketId}`);
  },

  // Create new ticket
  createTicket: async (data: CreateTicketData): Promise<TicketResponse> => {
    return apiCall<TicketResponse>("/support/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update ticket
  updateTicket: async (ticketId: number, data: UpdateTicketData): Promise<TicketResponse> => {
    return apiCall<TicketResponse>(`/support/tickets/${ticketId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete ticket
  deleteTicket: async (ticketId: number): Promise<{ success: boolean; message: string }> => {
    return apiCall<{ success: boolean; message: string }>(`/support/tickets/${ticketId}`, {
      method: "DELETE",
    });
  },
};

