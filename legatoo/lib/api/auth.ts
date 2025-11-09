// Authentication API functions

import { authUtils } from "../auth-utils";

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Backend expected format
export interface BackendSignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  account_type: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      email: string;
      is_active: boolean;
      is_verified: boolean;
      role: string;
      last_login: string;
    };
    profile: {
      id: number;
      first_name: string;
      last_name: string;
      phone_number: string;
      account_type: string;
    } | null;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  errors?: Record<string, string>;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  errors?: Record<string, string>;
}
// ok 
// thebase 

// Base API URL - you can change this to your actual API endpoint
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('fastestfranchise.net')
    ? "https://api.fastestfranchise.net/api/v1"
    : "http://localhost:8000/api/v1");

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Prepare headers - use Headers object for proper merging
  const headers = new Headers(options.headers);
  
  // Only set Content-Type for non-FormData requests that have a body
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers: headers,
    body: options.body, // Explicitly set body to ensure it's included
  };

  console.log("🚀 API Call:", {
    url,
    method: config.method || "GET",
    body: config.body,
    headers: Object.fromEntries(headers.entries()),
  });

  try {
    console.log("📡 Making request to:", url);
    const response = await fetch(url, config);

    console.log("📨 Response status:", response.status);
    console.log(
      "📨 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API Error:", errorData);
      throw {
        status: response.status,
        message: errorData.message || "An error occurred",
        errors: errorData.errors || {},
      };
    }

    const data = await response.json();
    console.log("✅ API Success:", data);
    return data;
  } catch (error) {
    console.error("💥 Fetch Error:", error);
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

const AUTH_ERROR = {
  status: 401,
  message: "Authentication required. Please login again.",
  errors: {},
} as const;

async function getValidToken(): Promise<string> {
  const hasValidToken = await authUtils.ensureValidToken();

  if (!hasValidToken) {
    if (typeof window !== "undefined") {
      authUtils.clearAuth();
      window.location.href = "/login";
    }
    throw { ...AUTH_ERROR };
  }

  const token = authUtils.getAccessToken();

  if (!token) {
    if (typeof window !== "undefined") {
      authUtils.clearAuth();
      window.location.href = "/login";
    }
    throw { ...AUTH_ERROR };
  }

  return token;
}

// Authentication API functions
export const authApi = {
  // Sign up
  signup: async (data: SignupData): Promise<AuthResponse> => {
    // Transform frontend data to backend format
    const backendData: BackendSignupData = {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phone,
      account_type: "personal",
    };

    console.log("🔄 Sending signup data to backend:", backendData);

    return apiCall<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(backendData),
    });
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    return apiCall<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Forgot password
  forgotPassword: async (
    data: ForgotPasswordData
  ): Promise<ForgotPasswordResponse> => {
    return apiCall<ForgotPasswordResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return apiCall<RefreshTokenResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  // Logout (if you have a logout endpoint)
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const token = authUtils.getRefreshToken();
    return apiCall<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token: token }),
    });
  },

  // Profile management
  getProfile: async (): Promise<{
    success: boolean;
    data?: {
      id: number;
      first_name: string;
      last_name: string;
      phone_number: string;
      account_type: string;
      email?: string;
      location?: string;
      created_at?: string;
      last_login?: string;
    };
    message?: string;
  }> => {
    const token = await getValidToken();
    return apiCall("/profile/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  updateProfile: async (data: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    location?: string;
  }): Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall("/profile/me", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{
    success: boolean;
    message?: string;
    errors?: Record<string, string>;
  }> => {
    return apiCall("/profile/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateNotifications: async (data: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    sms_notifications?: boolean;
    weekly_reports?: boolean;
    security_alerts?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    errors?: Record<string, string>;
  }> => {
    return apiCall("/profile/notifications", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updatePrivacy: async (data: {
    profile_visibility?: string;
    show_email?: boolean;
    show_phone?: boolean;
    show_location?: boolean;
    allow_direct_messages?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    errors?: Record<string, string>;
  }> => {
    return apiCall("/profile/privacy", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Document upload
  uploadDocuments: async (data: {
    files: File[];
    language: "english" | "arabic";
    contractType: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: {
      uploaded_documents: Array<{
        id: number;
        title: string;
        file_path: string;
        file_url?: string;
        document_type: string;
        language: "en" | "ar";
        processing_status: "pending" | "processing" | "done" | "error";
        is_processed: boolean;
        notes: string;
        chunks_count: number | null;
        created_at: string;
        uploaded_by_id: number;
      }>;
      uploaded_count: number;
      admin_info: {
        uploaded_by_admin: string;
        assigned_to_user: string | null;
        process_immediately: boolean;
        timestamp: string;
      };
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    const formData = new FormData();
    
    // Add metadata
    formData.append('language', data.language);
    formData.append('contract_type', data.contractType);
    
    // Add files
    data.files.forEach((file) => {
      formData.append('files', file);
    });

    return apiCall("/legal-cases/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      body: formData,
    });
  },

  // Get uploaded documents
  getDocuments: async (): Promise<{
    success: boolean;
    message?: string;
    data?: {
        documents: Array<{
          id: number;
          title: string;
          document_type: string;
          language: "en" | "ar";
          uploaded_by_id: number;
          created_at: string;
          processing_status: "pending" | "processing" | "done" | "error";
          is_processed: boolean;
          notes: string;
          file_path: string;
          chunks_count: number;
        }>;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall("/legal-cases/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Start model training
  startTraining: async (): Promise<{
    success: boolean;
    message?: string;
    data?: {
      training_session_id: string;
      status: "started" | "in_progress" | "completed" | "error";
      estimated_completion?: string;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall("/admin/training/start", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Get laws
  getLaws: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: {
      laws: Array<{
        id: number;
        name: string;
        type: string;
        jurisdiction: string;
        issuing_authority: string;
        issue_date: string | null;
        last_update: string | null;
        description: string;
        source_url: string;
        status: "raw" | "processed";
        created_at: string;
        updated_at: string | null;
      }>;
      pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
      };
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/laws/?${queryString}` : '/laws/';
    
    return apiCall(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Search similar laws / Answer query using RAG
  searchSimilarLaws: async (params: {
    query: string;
    document_id?: number;
    top_k?: number;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: {
      answer: string;
      query: string;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    
    // Build query parameters for POST request
    const queryParams = new URLSearchParams();
    queryParams.append('query', params.query);
    if (params.document_id) queryParams.append('document_id', params.document_id.toString());
    if (params.top_k) queryParams.append('top_k', params.top_k.toString());
    
    return apiCall(`/laws/query?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Upload laws documents
  uploadLaws: async (data: {
    pdf_file: File[];
    law_name: string;
    law_type: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: {
      uploaded_laws: Array<{
        id: number;
        name: string;
        type: string;
        jurisdiction: string;
        issuing_authority: string;
        issue_date: string | null;
        last_update: string | null;
        description: string;
        source_url: string;
        status: "raw" | "processed";
        created_at: string;
        updated_at: string | null;
      }>;
      uploaded_count: number;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    const formData = new FormData();
    
    // Add metadata
    formData.append('law_name', data.law_name);
    formData.append('law_type', data.law_type);
    
    // Add files - backend expects field name 'file' not 'pdf_file'
    data.pdf_file.forEach((file) => {
      formData.append('file', file);
    });

    return apiCall("/laws/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      body: formData,
    });
  },

  // Delete law
  deleteLaw: async (lawId: number): Promise<{
    success: boolean;
    message: string;
    data?: {
      deleted_law_id: number;
      deleted_law_name: string;
      deleted_chunks_count: number;
      knowledge_document_id: number;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/laws/${lawId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Get single document details
  getDocument: async (documentId: string): Promise<{
    success: boolean;
    message?: string;
    data?: {
      document: {
        id: number;
        title: string;
        document_type: string;
        language: "en" | "ar";
        uploaded_by_id: number;
        created_at: string;
        processing_status: "pending" | "processing" | "done" | "error";
        is_processed: boolean;
        notes: string;
        file_path: string;
        file_url?: string;
        chunks_count: number | null;
        analysis?: {
          type: string;
          confidence: number;
          keyPoints: string[];
          summary?: string;
          extractedClauses?: string[];
        };
      };
      chunks: Array<{
        id: number;
        chunk_index: number;
        content: string;
        article_number: string | null;
        section_title: string | null;
        keywords: string[];
        page_number: number | null;
        source_reference: string | null;
        has_embedding: boolean;
        created_at: string;
      }>;
      statistics: {
        total_chunks: number;
        chunks_with_embeddings: number;
        chunks_with_article_numbers: number;
        chunks_with_section_titles: number;
        keywords_extracted: number;
      };
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/legal-assistant/documents/${documentId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Update document metadata
  updateDocument: async (documentId: string, data: {
    language: "en" | "ar";
    document_type: string;
  }): Promise<{
    success: boolean;
    message?: string;
      data?: {
        id: number;
        title: string;
        document_type: string;
        language: "en" | "ar";
        updated_at: string;
      };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/legal-assistant/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Delete document
  deleteDocument: async (documentId: string): Promise<{
    success: boolean;
    message?: string;
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/legal-cases/${documentId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Get law articles (simplified structure without branches and chapters)
  getLawTree: async (lawId: number): Promise<{
    success: boolean;
    message?: string;
    data?: {
      law_source: {
        id: number;
        name: string;
        type: string;
        jurisdiction: string;
        issuing_authority: string;
        issue_date: string | null;
        last_update: string | null;
        description: string;
        source_url: string;
        status: "raw" | "processed";
        articles: Array<{
          id: number;
          article_number: string;
          title: string;
          content: string;
          keywords: string[];
          order_index: number;
          ai_processed_at: string | null;
          created_at: string;
        }>;
      };
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/laws/${lawId}/articles`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  uploadCase: async (data: {
    file: File;
    title: string;
    case_number?: string | null;
    description?: string | null;
    jurisdiction?: string | null;
    court_name?: string | null;
    decision_date?: string | null;
    case_type?: string | null;
    court_level?: string | null;
  }): Promise<{
    success: boolean;
    message: string;
    data?: {
      uploaded_case: {
        id: number;
        title: string;
        case_number: string | null;
        description: string | null;
        jurisdiction: string | null;
        court_name: string | null;
        decision_date: string | null;
        involved_parties: string | null;
        case_type: string | null;
        court_level: string | null;
        case_outcome: string | null;
        judge_names: string | null;
        claim_amount: number | null;
        status: "raw" | "processed";
        created_at: string;
      };
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    const formData = new FormData();
    
    formData.append('file', data.file);
    formData.append('title', data.title);
    if (data.case_number) formData.append('case_number', data.case_number);
    if (data.description) formData.append('description', data.description);
    if (data.jurisdiction) formData.append('jurisdiction', data.jurisdiction);
    if (data.court_name) formData.append('court_name', data.court_name);
    if (data.decision_date) formData.append('decision_date', data.decision_date);
    if (data.case_type) formData.append('case_type', data.case_type);
    if (data.court_level) formData.append('court_level', data.court_level);

    return apiCall('/legal-cases/upload', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
  },

  getCases: async (params?: {
    skip?: number;
    limit?: number;
    jurisdiction?: string;
    case_type?: string;
    court_level?: string;
    status?: string;
    search?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: {
      cases: Array<{
        id: number;
        case_number: string | null;
        title: string;
        description: string | null;
        jurisdiction: string | null;
        court_name: string | null;
        decision_date: string | null;
        case_type: string | null;
        court_level: string | null;
        case_outcome: string | null;
        status: "raw" | "processed";
        document_id: number;
        created_at: string;
      }>;
      total: number;
      skip: number;
      limit: number;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.jurisdiction) queryParams.append('jurisdiction', params.jurisdiction);
    if (params?.case_type) queryParams.append('case_type', params.case_type);
    if (params?.court_level) queryParams.append('court_level', params.court_level);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    // Try with trailing slash first (as per API documentation)
    const endpoint = queryString ? `/legal-cases/?${queryString}` : '/legal-cases/';
    
    try {
      return await apiCall(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (error) {
      // If 405 error, try without trailing slash as fallback
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 405) {
        console.log("🔄 Retrying without trailing slash...");
        const fallbackEndpoint = queryString ? `/legal-cases?${queryString}` : '/legal-cases';
        return apiCall(fallbackEndpoint, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
      throw error;
    }
  },

  getCaseDetail: async (caseId: number): Promise<{
    success: boolean;
    message?: string;
    data?: {
      id: number;
      case_number: string | null;
      title: string;
      description: string | null;
      jurisdiction: string | null;
      court_name: string | null;
      decision_date: string | null;
      case_type: string | null;
      court_level: string | null;
      case_outcome: string | null;
      status: "raw" | "processed";
      document_id: number;
      created_at: string;
      updated_at?: string;
      sections?: Array<{
        id: number;
        section_type: string;
        content: string;
        created_at: string;
      }>;
      sections_count?: number;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/legal-cases/${caseId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  updateCase: async (caseId: number, data: {
    title?: string;
    case_number?: string | null;
    description?: string | null;
    jurisdiction?: string | null;
    court_name?: string | null;
    decision_date?: string | null;
    case_type?: string | null;
    court_level?: string | null;
  }): Promise<{
    success: boolean;
    message: string;
    data?: {
      updated_case: {
        id: number;
        title: string;
        case_number: string | null;
        description: string | null;
        jurisdiction: string | null;
        court_name: string | null;
        decision_date: string | null;
        case_type: string | null;
        court_level: string | null;
      };
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/legal-cases/${caseId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  deleteCase: async (caseId: number): Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/legal-cases/${caseId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  // Generate embeddings for a law document
  generateEmbeddings: async (documentId: number): Promise<{
    success: boolean;
    message: string;
    data?: {
      document_id: number;
      status: string;
      message: string;
    };
    errors?: Record<string, string>;
  }> => {
    const token = await getValidToken();
    return apiCall(`/laws/${documentId}/generate-embeddings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },
};
