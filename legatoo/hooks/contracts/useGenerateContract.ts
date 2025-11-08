import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  contractsApi,
  AIGenerateRequest,
  AIGenerateResponse,
  ContractCreate,
} from "@/lib/api/contracts";
import { contractKeys } from "./useContracts";

// Generate contract with AI
export function useGenerateContract() {
  return useMutation({
    mutationFn: (data: AIGenerateRequest) => contractsApi.generateContract(data),
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate contract");
    },
  });
}

// Save AI-generated contract
export function useSaveAIContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: ContractCreate }) =>
      contractsApi.saveAIContract(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      toast.success("Contract saved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save contract");
    },
  });
}
