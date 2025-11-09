// Contracts Library API functions

import { authUtils } from "../auth-utils";

// Base API URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('fastestfranchise.net')
    ? "https://api.fastestfranchise.net/api/v1"
    : "http://localhost:8000/api/v1");

// Generic API call function with auth
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
      message: "Session expired. Please login again.",
      errors: {},
    };
  }

  let token = authUtils.getAccessToken();
  if (!token) {
    throw {
      status: 401,
      message: "Session expired. Please login again.",
      errors: {},
    };
  }

  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
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
        if (!token) {
          throw {
            status: 401,
            message: "Session expired. Please login again.",
            errors: {},
          };
        }
        headers.set("Authorization", `Bearer ${token}`);
        
        const retryResponse = await fetch(url, {
          ...config,
          headers,
        });
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw {
            status: retryResponse.status,
            message: errorData.detail || errorData.message || "Request failed",
            errors: errorData.errors || {},
          };
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
      throw {
        status: response.status,
        message: errorData.detail || errorData.message || "An error occurred",
        errors: errorData.errors || {},
      };
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

// ============ Types ============

export interface Contract {
  id: string;
  title: string;
  category: string | null;
  jurisdiction: string | null;
  language: string;
  status: "draft" | "active" | "archived";
  version: number;
  ai_generated: boolean;
  content: string | null;
  created_by: number;
  created_at: string;
  updated_at: string | null;
}

export interface ContractListResponse {
  contracts: Contract[];
  total: number;
  page: number;
  page_size: number;
}

export interface ContractCreate {
  title: string;
  category?: string;
  jurisdiction?: string;
  language?: string;
  status?: "draft" | "active" | "archived";
  content?: string;
}

export interface ContractUpdate {
  title?: string;
  category?: string;
  jurisdiction?: string;
  language?: string;
  status?: "draft" | "active" | "archived";
  content?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  content: string;
  language: string;
  jurisdiction: string | null;
  is_public: boolean;
  created_by: number;
  created_at: string;
  updated_at: string | null;
}

export interface TemplateListResponse {
  templates: ContractTemplate[];
  total: number;
  page: number;
  page_size: number;
}

export interface TemplateCreate {
  name: string;
  description?: string;
  tags?: string[];
  content: string;
  language?: string;
  jurisdiction?: string;
  is_public?: boolean;
}

export interface TemplateUpdate {
  name?: string;
  description?: string;
  tags?: string[];
  content?: string;
  language?: string;
  jurisdiction?: string;
  is_public?: boolean;
}

export interface Revision {
  id: string;
  contract_id: string;
  revision_number: number;
  changes_summary: string | null;
  updated_content: string;
  updated_by: number;
  updated_at: string;
}

export interface RevisionHistoryResponse {
  contract_id: string;
  revisions: Revision[];
  total_revisions: number;
}

export interface AIGenerateRequest {
  prompt_text: string;
  category?: string;
  jurisdiction?: string;
  language?: string;
  structured_data?: Record<string, unknown>;
  ai_model?: string;
}

export interface AIGenerateResponse {
  request_id: string;
  generated_content: string;
  ai_model: string;
  created_at: string;
  contract_id?: string;
}

export interface ContractFilters {
  category?: string;
  jurisdiction?: string;
  status?: string;
  language?: string;
  ai_generated?: boolean;
  search_query?: string;
  page?: number;
  page_size?: number;
}

export interface TemplateFilters {
  category?: string;
  jurisdiction?: string;
  language?: string;
  is_public?: boolean;
  tags?: string[];
  search_query?: string;
  page?: number;
  page_size?: number;
}

// ============ API Functions ============

export const contractsApi = {
  // Get all contracts
  getContracts: async (filters: ContractFilters = {}): Promise<ContractListResponse> => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.jurisdiction) params.append("jurisdiction", filters.jurisdiction);
    if (filters.status) params.append("status", filters.status);
    if (filters.language) params.append("language", filters.language);
    if (filters.ai_generated !== undefined) params.append("ai_generated", String(filters.ai_generated));
    if (filters.search_query) params.append("search_query", filters.search_query);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.page_size) params.append("page_size", String(filters.page_size));

    return apiCall<ContractListResponse>(`/contracts?${params.toString()}`);
  },

  // Get single contract
  getContract: async (id: string): Promise<Contract> => {
    return apiCall<Contract>(`/contracts/${id}`);
  },

  // Create contract
  createContract: async (data: ContractCreate): Promise<Contract> => {
    return apiCall<Contract>("/contracts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update contract
  updateContract: async (id: string, data: ContractUpdate): Promise<Contract> => {
    return apiCall<Contract>(`/contracts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete contract
  deleteContract: async (id: string): Promise<void> => {
    return apiCall<void>(`/contracts/${id}`, {
      method: "DELETE",
    });
  },

  // Generate contract with AI
  generateContract: async (data: AIGenerateRequest): Promise<AIGenerateResponse> => {
    return apiCall<AIGenerateResponse>("/contracts/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Save AI-generated contract
  saveAIContract: async (requestId: string, data: ContractCreate): Promise<Contract> => {
    return apiCall<Contract>(`/contracts/generate/${requestId}/save`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get revision history
  getRevisionHistory: async (contractId: string): Promise<RevisionHistoryResponse> => {
    return apiCall<RevisionHistoryResponse>(`/contracts/${contractId}/history`);
  },

  // Create revision
  createRevision: async (contractId: string, data: { changes_summary?: string; updated_content: string }): Promise<Contract> => {
    return apiCall<Contract>(`/contracts/${contractId}/revise`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get templates
  getTemplates: async (filters: TemplateFilters = {}): Promise<TemplateListResponse> => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.jurisdiction) params.append("jurisdiction", filters.jurisdiction);
    if (filters.language) params.append("language", filters.language);
    if (filters.is_public !== undefined) params.append("is_public", String(filters.is_public));
    if (filters.tags?.length) params.append("tags", filters.tags.join(","));
    if (filters.search_query) params.append("search_query", filters.search_query);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.page_size) params.append("page_size", String(filters.page_size));

    return apiCall<TemplateListResponse>(`/contracts/templates?${params.toString()}`);
  },

  // Get single template
  getTemplate: async (id: string): Promise<ContractTemplate> => {
    return apiCall<ContractTemplate>(`/contracts/templates/${id}`);
  },

  // Create template
  createTemplate: async (data: TemplateCreate): Promise<ContractTemplate> => {
    return apiCall<ContractTemplate>("/contracts/templates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update template
  updateTemplate: async (id: string, data: TemplateUpdate): Promise<ContractTemplate> => {
    return apiCall<ContractTemplate>(`/contracts/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<void> => {
    return apiCall<void>(`/contracts/templates/${id}`, {
      method: "DELETE",
    });
  },

  // Generate contract from template
  generateFromTemplate: async (templateId: string, placeholderData: Record<string, unknown>): Promise<Contract> => {
    return apiCall<Contract>(`/contracts/templates/${templateId}/generate`, {
      method: "POST",
      body: JSON.stringify(placeholderData),
    });
  },

  // Export contract as PDF or Word
  exportContract: async (contractId: string, format: "pdf" | "docx"): Promise<Blob> => {
    const url = `${API_BASE_URL}/contracts/${contractId}/export?format=${format}`;
    
    // Ensure token is valid before making request
    const hasValidToken = await authUtils.ensureValidToken();
    if (!hasValidToken) {
      throw {
        status: 401,
        message: "Session expired. Please login again.",
        errors: {},
      };
    }

    const token = authUtils.getAccessToken();
    if (!token) {
      throw {
        status: 401,
        message: "Session expired. Please login again.",
        errors: {},
      };
    }

    const headers = new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || errorData.message || "Failed to export contract",
        errors: errorData.errors || {},
      };
    }

    return await response.blob();
  },
};
