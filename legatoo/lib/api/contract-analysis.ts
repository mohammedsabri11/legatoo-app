// Contract Analysis API functions

import { authUtils } from "../auth-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('fastestfranchise.net')
    ? "https://api.fastestfranchise.net/api/v1"
    : "http://localhost:8000/api/v1");

// Generic API call function with authentication
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = authUtils.getAccessToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Don't set Content-Type for FormData - browser will set it with boundary
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  try {
    const response = await fetch(url, config);

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

export interface ContractAnalysisData {
  weak_points: string[];
  risks: string[];
  suggestions: string[];
}

export interface ContractAnalysisResponse {
  success: boolean;
  message: string;
  data?: ContractAnalysisData;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export const contractAnalysisApi = {
  // Analyze contract
  analyze: async (file: File): Promise<ContractAnalysisResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiCall<ContractAnalysisResponse>("/legal-cases/analyse-contract", {
      method: "POST",
      body: formData,
    });
  },
};

