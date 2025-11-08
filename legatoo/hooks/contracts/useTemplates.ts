import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  contractsApi,
  ContractTemplate,
  TemplateCreate,
  TemplateUpdate,
  TemplateFilters,
} from "@/lib/api/contracts";

// Query keys
export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (filters?: TemplateFilters) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

// Get templates list
export function useTemplates(filters: TemplateFilters = {}) {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => contractsApi.getTemplates(filters),
    staleTime: 60000, // 1 minute
  });
}

// Get single template
export function useTemplate(id: string | null) {
  return useQuery({
    queryKey: templateKeys.detail(id!),
    queryFn: () => contractsApi.getTemplate(id!),
    enabled: !!id,
    staleTime: 60000,
  });
}

// Create template mutation
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TemplateCreate) => contractsApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success("Template created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create template");
    },
  });
}

// Update template mutation
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TemplateUpdate }) =>
      contractsApi.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success("Template updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update template");
    },
  });
}

// Delete template mutation
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success("Template deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete template");
    },
  });
}

// Generate contract from template
export function useGenerateFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: Record<string, any> }) =>
      contractsApi.generateFromTemplate(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contract generated from template!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate contract");
    },
  });
}
