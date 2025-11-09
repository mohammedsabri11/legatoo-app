// Case Analysis API functions

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
  const hasValidToken = await authUtils.ensureValidToken();
  if (!hasValidToken) {
    throw {
      status: 401,
      message: "Authentication required. Please login again.",
      errors: {},
    };
  }

  const token = authUtils.getAccessToken();
  if (!token) {
    throw {
      status: 401,
      message: "Authentication required. Please login again.",
      errors: {},
    };
  }

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

export interface CaseAnalysisRequest {
  files: File[];
  analysis_type: "case-analysis" | "contract-review";
  lawsuit_type: string;
  result_seeking: string;
  user_context?: string;
}

export interface AnalysisSections {
  executive_summary?: string;
  legal_analysis?: string;
  legal_status?: string;
  weak_points?: string;
  strong_points?: string;
  legal_basis?: string;
  risk_analysis?: string;
  obligations_rights?: string;
  recommendations?: string;
  settlement_recommendations?: string;
  legal_action_recommendations?: string;
  protection_recommendations?: string;
  client_information?: string;
  simple_explanation?: string;
  next_steps?: string;
  legal_strategy?: string;
  legal_research?: string;
  professional_risks?: string;
  quantitative_assessment?: string;
  legal_references?: string;
  key_findings?: string[];
  detailed_recommendations?: string[];
  formatted_analysis?: string;
}

export interface CaseAnalysisData {
  filename: string;
  uploaded_at: string;
  status: "completed" | "processing" | "failed";
  analysis_type: string;
  lawsuit_type: string;
  result_seeking: string;
  analysis: {
    risk_score?: number;
    risk_label?: string;
    full_analysis?: string;
    formatted_analysis?: string;
    sections?: AnalysisSections;
  };
  additional_files?: Array<{
    filename: string;
    size_mb: number;
  }>;
}

export interface CaseAnalysisResponse {
  success: boolean;
  message: string;
  data?: CaseAnalysisData & {
    analysis_id?: string | number | null;
  };
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface AnalysisHistoryItem {
  id: number;
  filename: string;
  file_size_mb?: number;
  analysis_type: string;
  lawsuit_type: string;
  result_seeking?: string;
  user_context?: string;
  analysis_data: CaseAnalysisData;
  risk_score?: number;
  risk_label?: string;
  additional_files?: Array<{
    filename: string;
    size_mb: number;
  }>;
  created_at: string;
  updated_at?: string;
}

export interface AnalysisHistoryResponse {
  success: boolean;
  message: string;
  data: {
    analyses: AnalysisHistoryItem[];
    total: number;
    skip: number;
    limit: number;
  };
  errors?: Record<string, string>;
}

export interface SingleAnalysisResponse {
  success: boolean;
  message: string;
  data: AnalysisHistoryItem;
  errors?: Record<string, string>;
}

export const caseAnalysisApi = {
  // Analyze legal case
  analyze: async (request: CaseAnalysisRequest): Promise<CaseAnalysisResponse> => {
    const formData = new FormData();
    
    // Append files
    request.files.forEach((file) => {
      formData.append("files", file);
    });
    
    // Append analysis parameters
    formData.append("analysis_type", request.analysis_type);
    formData.append("lawsuit_type", request.lawsuit_type);
    formData.append("result_seeking", request.result_seeking);
    if (request.user_context) {
      formData.append("user_context", request.user_context);
    }

    return apiCall<CaseAnalysisResponse>("/legal-cases/analysis", {
      method: "POST",
      body: formData,
    });
  },

  // Get analysis history
  getHistory: async (
    skip: number = 0,
    limit: number = 100,
    analysis_type?: string
  ): Promise<AnalysisHistoryResponse> => {
    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());
    if (analysis_type) {
      params.append("analysis_type", analysis_type);
    }

    return apiCall<AnalysisHistoryResponse>(
      `/legal-cases/analysis/history?${params.toString()}`,
      {
        method: "GET",
      }
    );
  },

  // Get analysis by ID
  getAnalysisById: async (analysisId: number): Promise<SingleAnalysisResponse> => {
    return apiCall<SingleAnalysisResponse>(`/legal-cases/analysis/${analysisId}`, {
      method: "GET",
    });
  },

  // Download PDF
  downloadPDF: async (analysisId: number): Promise<Blob> => {
    const url = `${API_BASE_URL}/legal-cases/analysis/${analysisId}/download`;
    const hasValidToken = await authUtils.ensureValidToken();
    if (!hasValidToken) {
      throw {
        status: 401,
        message: "Authentication required. Please login again.",
        errors: {},
      };
    }

    const token = authUtils.getAccessToken();
    if (!token) {
      throw {
        status: 401,
        message: "Authentication required. Please login again.",
        errors: {},
      };
    }

    const headers = new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || "Download failed",
        errors: errorData.errors || {},
      };
    }

    return await response.blob();
  },

  // Delete analysis
  deleteAnalysis: async (analysisId: number): Promise<{ success: boolean; message: string }> => {
    return apiCall(`/legal-cases/analysis/${analysisId}`, {
      method: "DELETE",
    });
  },
};

