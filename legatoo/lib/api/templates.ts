// Templates API functions

import { authUtils } from "../auth-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('fastestfranchise.net')
    ? "https://api.fastestfranchise.net/api/v1"
    : "http://localhost:8000/api/v1");

// Generic API call function with authentication
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
        message: errorData.message || "An error occurred",
        errors: errorData.errors || {},
      };
    }

    const data = await response.json();
    return data;
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

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea';
  required: boolean;
  default?: string;
  placeholder?: string;
  validation?: Record<string, unknown>;
}

export interface TemplateVariablesResponse {
  id: string;
  title: string;
  description?: string;
  variables: TemplateVariable[];
}

export interface GenerateContractRequest {
  filled_data: Record<string, unknown>;
}

export interface GenerateContractResponse {
  contract_id: string;
  pdf_url: string;
  success: boolean;
}

export interface TemplateListItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  format: string;
  is_premium: boolean;
  created_at?: string;
}

export const templatesApi = {
  /**
   * List all available templates
   */
  getTemplates: async (): Promise<TemplateListItem[]> => {
    const response = await apiCall<{
      success: boolean;
      data: TemplateListItem[];
      message: string;
    }>("/templates/");
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to get templates");
  },

  /**
   * Get template variables for form generation
   */
  getTemplateVariables: async (templateId: string): Promise<TemplateVariablesResponse> => {
    const response = await apiCall<{
      success: boolean;
      data: TemplateVariablesResponse;
      message: string;
    }>(`/templates/${templateId}/variables`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to get template variables");
  },

  /**
   * Generate contract from template and form data
   */
  generateContract: async (
    templateId: string,
    filledData: Record<string, unknown>
  ): Promise<GenerateContractResponse> => {
    const response = await apiCall<{
      success: boolean;
      data: GenerateContractResponse;
      message: string;
    }>(`/templates/${templateId}/generate`, {
      method: "POST",
      body: JSON.stringify({
        filled_data: filledData,
      }),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to generate contract");
  },
};

