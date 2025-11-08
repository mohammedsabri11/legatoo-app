import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  contractsApi,
  Contract,
  ContractCreate,
  ContractUpdate,
  ContractFilters,
} from "@/lib/api/contracts";

// Query keys
export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (filters?: ContractFilters) => [...contractKeys.lists(), filters] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
  history: (id: string) => [...contractKeys.all, "history", id] as const,
};

// Get contracts list
export function useContracts(filters: ContractFilters = {}) {
  return useQuery({
    queryKey: contractKeys.list(filters),
    queryFn: () => contractsApi.getContracts(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Get single contract
export function useContract(id: string | null) {
  return useQuery({
    queryKey: contractKeys.detail(id!),
    queryFn: () => contractsApi.getContract(id!),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
}

// Create contract mutation
export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContractCreate) => contractsApi.createContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      toast.success("Contract created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create contract");
    },
  });
}

// Update contract mutation
export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContractUpdate }) =>
      contractsApi.updateContract(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      toast.success("Contract updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update contract");
    },
  });
}

// Delete contract mutation
export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsApi.deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      toast.success("Contract archived successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete contract");
    },
  });
}

// Get revision history
export function useContractHistory(contractId: string | null) {
  return useQuery({
    queryKey: contractKeys.history(contractId!),
    queryFn: () => contractsApi.getRevisionHistory(contractId!),
    enabled: !!contractId,
    staleTime: 60000,
  });
}
