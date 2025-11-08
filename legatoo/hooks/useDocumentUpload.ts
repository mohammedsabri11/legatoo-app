import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { toast } from "react-hot-toast";

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  detail: (id: string) => [...documentKeys.all, "detail", id] as const,
};

export interface UploadDocumentData {
  pdf_file: File[];
  law_name: string;
  law_type: string;
}

export interface UploadCaseData {
  file: File;
  title: string;
  case_number?: string | null;
  description?: string | null;
  jurisdiction?: string | null;
  court_name?: string | null;
  decision_date?: string | null;
  involved_parties?: string | null;
  case_type?: string | null;
  court_level?: string | null;
  case_outcome?: string | null;
  judge_names?: string | null;
  claim_amount?: number | null;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  size: number;
  status: "uploading" | "processing" | "completed" | "error";
  upload_date?: string;
  language?: "english" | "arabic";
  contract_type?: string;
  analysis?: {
    type: string;
    confidence: number;
    keyPoints: string[];
  };
}

export function useDocumentUpload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { files: File[]; language: "english" | "arabic"; contractType: string }) => authApi.uploadDocuments(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Files uploaded successfully!");
        // Invalidates and refetches documents list
        queryClient.invalidateQueries({ queryKey: ["documents"] });
      } else {
        toast.error(response.message || "Upload failed");
      }
    },
    onError: (error: { message?: string; status?: number }) => {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed. Please try again.");
    },
  });
}

export function useCaseUpload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UploadCaseData) => authApi.uploadCase(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Case uploaded successfully!");
        // Invalidates and refetches cases list
        queryClient.invalidateQueries({ queryKey: ["cases"] });
      } else {
        toast.error(response.message || "Upload failed");
      }
    },
    onError: (error: { message?: string; status?: number }) => {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed. Please try again.");
    },
  });
}

export function useCases(params?: {
  skip?: number;
  limit?: number;
  jurisdiction?: string;
  case_type?: string;
  court_level?: string;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["cases", params],
    queryFn: () => authApi.getCases(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCaseDetail(caseId?: string) {
  return useQuery({
    queryKey: ["cases", "detail", caseId],
    queryFn: () => authApi.getCaseDetail(parseInt(caseId!)),
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, data }: { 
      caseId: number; 
      data: {
        title?: string;
        case_number?: string | null;
        description?: string | null;
        jurisdiction?: string | null;
        court_name?: string | null;
        decision_date?: string | null;
        case_type?: string | null;
        court_level?: string | null;
      }
    }) => authApi.updateCase(caseId, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Case updated successfully!");
        // Invalidate and refetch cases list
        queryClient.invalidateQueries({ queryKey: ["cases"] });
      } else {
        toast.error(response.message || "Update failed");
      }
    },
    onError: (error: { message?: string }) => {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update case");
    },
  });
}

export function useDeleteCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (caseId: number) => authApi.deleteCase(caseId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Case deleted successfully!");
        // Invalidate and refetch cases list
        queryClient.invalidateQueries({ queryKey: ["cases"] });
      } else {
        toast.error(response.message || "Delete failed");
      }
    },
    onError: (error: { message?: string }) => {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete case");
    },
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => authApi.getDocuments(),
    select: (response) => {
      if (response.success && response.data) {
        return response.data.documents;
      }
      return [];
    },
  });
}

export function useStartTraining() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.startTraining(),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Training started successfully!");
        // Refresh docs to see update
        queryClient.invalidateQueries({ queryKey: ["documents"] });
      } else {
        toast.error(response.message || "Failed to start training");
      }
    },
    onError: (error: { message?: string; status?: number }) => {
      console.error("Training error:", error);
      toast.error(error.message || "Failed to start training. Please try again.");
    },
  });
}

export function useDocumentDetail(documentId?: string) {
  return useQuery({
    queryKey: [...documentKeys.detail(documentId || "")],
    queryFn: () => authApi.getDocument(documentId!),
    enabled: !!documentId,
    select: (response) => {
      if (response.success && response.data) {
        return response.data; // Return full data object with document, chunks, statistics
      }
      return null;
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { documentId: string; language: "en" | "ar"; document_type: string }) =>
      authApi.updateDocument(data.documentId, {
        language: data.language,
        document_type: data.document_type,
      }),
    onSuccess: () => {
      toast.success("Document updated successfully!");
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error: { message?: string; status?: number }) => {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update document. Please try again.");
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => authApi.deleteDocument(documentId),
    onSuccess: () => {
      toast.success("Document deleted successfully!");
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error: { message?: string; status?: number }) => {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete document. Please try again.");
    },
  });
}

export function useLaws(params?: {
  page?: number;
  page_size?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["laws", params],
    queryFn: () => authApi.getLaws(params),
    select: (response) => {
      if (response.success && response.data) {
        return {
          laws: response.data.laws,
          pagination: response.data.pagination,
        };
      }
      return {
        laws: [],
        pagination: {
          page: 1,
          page_size: 20,
          total: 0,
          total_pages: 0,
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLawsUpload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UploadDocumentData) => authApi.uploadLaws(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Laws uploaded successfully!");
        // Invalidates and refetches laws list
        queryClient.invalidateQueries({ queryKey: ["laws"] });
      } else {
        toast.error(response.message || "Upload failed");
      }
    },
    onError: (error: { message?: string; status?: number }) => {
      console.error("Laws upload error:", error);
      toast.error(error.message || "Upload failed. Please try again.");
    },
  });
}

export function useLawTree(lawId?: number) {
  return useQuery({
    queryKey: ["lawTree", lawId],
    queryFn: () => authApi.getLawTree(lawId!),
    enabled: !!lawId,
    select: (response) => {
      if (response.success && response.data) {
        return response.data.law_source;
      }
      return null;
    },
  });
}

export function useDeleteLaw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lawId: number) => authApi.deleteLaw(lawId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Law deleted successfully!");
        // Invalidate and refetch laws list
        queryClient.invalidateQueries({ queryKey: ["laws"] });
      } else {
        toast.error(response.message || "Delete failed");
      }
    },
    onError: (error: { message?: string }) => {
      console.error("Delete law error:", error);
      toast.error(error.message || "Failed to delete law");
    },
  });
}